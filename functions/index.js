/**
 * index.js
 * Backend principal (Express) que:
 *  - Llegeix secrets des de .env.development (desenvolupament) o Google Secret Manager (producció).
 *  - Configura i exporta l'aplicació com a Cloud Function (Generació 2).
 *  - Gestiona rutes per interactuar amb Printful, com ara:
 *    - Creació de comandes en estat draft (producció).
 *    - Confirmació automàtica de comandes després del pagament amb Stripe.
 *  - Configura una sessió de pagament amb Stripe.
 *  - Ofereix rutes per calcular preus d'enviament, obtenir productes i més.
 */

const dotenv = require("dotenv");
const { onRequest } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const { Timestamp } = require("firebase-admin/firestore");
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const Stripe = require("stripe");
const path = require("path");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

// Inicialitzar admin SDK i Firestore
admin.initializeApp();
const db = admin.firestore();

// Client de Google Secret Manager
const client = new SecretManagerServiceClient();

// Variables globals
const secrets = {};
let stripe;
let transporter;

/* Funció auxiliar per accedir a secrets */
async function accessSecret(secretName) {
  const [version] = await client.accessSecretVersion({
    name: secretName,
  });
  return version.payload.data.toString("utf8");
}

/* Carregar secrets des de Google Secret Manager o .env */
const loadSecrets = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      //console.log("Carregant secrets per a producció...");
      secrets.FRONTEND_URL_PROD = await accessSecret("projects/217056402289/secrets/FRONTEND_URL_PROD/versions/latest");
      secrets.PRINTFUL_API_KEY = await accessSecret("projects/217056402289/secrets/PRINTFUL_API_KEY/versions/latest");
      secrets.STRIPE_SECRET_KEY_TEST = await accessSecret("projects/217056402289/secrets/STRIPE_SECRET_KEY_TEST/versions/latest");
      secrets.STRIPE_SECRET_KEY_LIVE = await accessSecret("projects/217056402289/secrets/STRIPE_SECRET_KEY_LIVE/versions/latest");
      secrets.EMAIL_USER = await accessSecret("projects/217056402289/secrets/EMAIL_USER/versions/latest");
      secrets.EMAIL_PASS = await accessSecret("projects/217056402289/secrets/EMAIL_PASS/versions/latest");
      //console.log("Secrets carregades per a producció:", secrets);
    } else {
      //console.log("Carregant secrets per a desenvolupament...");
      dotenv.config({ path: path.resolve(__dirname, ".env.development") });
      //console.log("Variables d'entorn carregades:", process.env);

      secrets.FRONTEND_URL = process.env.FRONTEND_URL || process.env.FRONTEND_URL_DEV;
      secrets.PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
      secrets.STRIPE_SECRET_KEY_TEST = process.env.STRIPE_SECRET_KEY_TEST;
      secrets.STRIPE_SECRET_KEY_LIVE = process.env.STRIPE_SECRET_KEY_LIVE;
      secrets.EMAIL_USER = process.env.EMAIL_USER;
      secrets.EMAIL_PASS = process.env.EMAIL_PASS;
      //console.log("Secrets carregades (desenvolupament):", secrets);
    }

    // Inicialitzar Stripe
    if (secrets.STRIPE_SECRET_KEY_LIVE || secrets.STRIPE_SECRET_KEY_TEST) {
      const stripeKey =
        process.env.NODE_ENV === "production"
          ? secrets.STRIPE_SECRET_KEY_LIVE
          : secrets.STRIPE_SECRET_KEY_TEST;

      stripe = new Stripe(stripeKey.trim());
      //console.log("Stripe inicialitzat correctament (clau):", stripeKey ? "Sí" : "No");
    } else {
      //console.error("Falta la clau de Stripe!");
    }

    // Configurar Nodemailer
    if (secrets.EMAIL_USER && secrets.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: secrets.EMAIL_USER.trim(),
          pass: secrets.EMAIL_PASS.trim(),
        },
      });

      try {
        await transporter.verify();
        //console.log("Servidor de correu llest per enviar missatges");
      } catch (error) {
        console.error("Error configurant transporter:", error);
      }
    } else {
      console.error("No hi ha credencials d'email configurades.");
    }
  } catch (error) {
    console.error("Error carregant les secrets:", error);
  }
};

const secretsLoaded = loadSecrets().catch((err) => {
  console.error("Error carregant secrets:", err);
});

/* Middleware per assegurar la càrrega de secrets */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/* Configuració d'Express */
const app = express();

// Configuració de CORS
const allowedOrigins = [
  "http://localhost:3000",
  "https://www.aborrasdesign.com",
  "https://aborrasdesign-b281d.firebaseapp.com",
  "https://aborrasdesign-b281d.web.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Carregar secrets abans de rutes
app.use(
  asyncHandler(async (req, res, next) => {
    await secretsLoaded;
    next();
  })
);

/* Middleware d'error */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Internal server error." });
});

if (process.env.NODE_ENV !== "production") {
  app.get("/", (req, res) => res.send("Backend està funcionant correctament! Versió 2"));
  app.get("/test-route", (req, res) => res.status(200).send("El backend està funcionant correctament!"));
}


/* Rutes Printful i Stripe */
async function printfulFetch(endpoint, method = "GET", body = null) {
  if (!secrets.PRINTFUL_API_KEY) {
    throw new Error("Falta PRINTFUL_API_KEY");
  }

  const apiKeyClean = secrets.PRINTFUL_API_KEY.trim();
  const url = `https://api.printful.com/${endpoint}`;
  const headers = {
    Authorization: `Bearer ${apiKeyClean}`,
    "Content-Type": "application/json",
  };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Printful API Error: ${response.status} - ${response.statusText} - ${errorText}`);
  }

  return response.json(); 
}

/*  Auxiliars Printful */
async function getProductsFromPrintful() {
  const data = await printfulFetch("store/products");
  return data.result;
}
async function getProductDetailsFromPrintful(productId) {
  return (await printfulFetch(`store/products/${productId}`)).result;
}
function validateShippingRequest(req, res, next) {
  const { recipient, items } = req.body;
  if (
    !items ||
    !recipient ||
    !recipient.address1 ||
    !recipient.city ||
    !recipient.country_code ||
    !recipient.zip
  ) {
    return res.status(400).json({ success: false, error: "Invalid request format (shipping)." });
  }
  next();
}

/**
 * ============================================
 *    Rutes Printful ( GET productes, etc. )
 * ============================================
 */
app.get('/printful/products', async (req, res) => {
  try {
    const products = await getProductsFromPrintful();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No s'han pogut obtenir els productes." });
  }
});

app.get('/printful/products/:productId', async (req, res) => {
  try {
    const product = await getProductDetailsFromPrintful(req.params.productId);
    res.json(product);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    res.status(500).json({ error: 'No s\'ha pogut obtenir el producte.' });
  }
});

app.get('/printful/orders', async (req, res) => {
  try {
    const data = await printfulFetch('orders');
    res.status(200).json({ success: true, orders: data.result });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/printful/orders/:orderId', async (req, res) => {
  try {
    const data = await printfulFetch(`orders/${req.params.orderId}`);
    res.status(200).json({ success: true, order: data.result });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ============================================
 *  Crear comanda Printful (Estat DRAFT)
 * ============================================
 * NOTA: Si estem en producció, es crea una comanda real a Printful en estat "draft".
 *       Si estem en desenvolupament, retornem un objecte simulat i la desem a Firestore perquè 
 *       es pugui veure en l’historial local (però no s’envia a Printful).
 */
app.post('/printful/create-order', async (req, res) => {
  try {
    const { recipient, items, userId, retail_costs } = req.body;

    if (!recipient || !items || !items.length || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing recipient, items or userId.',
      });
    }

    // ============== MODE DEV: NO CREEM A PRINTFUL, PERÒ GUARDEM A FIRESTORE ==============
    if (process.env.NODE_ENV !== 'production') {
      // Generem un ID fictici
      const devOrderId = `DEV_ORDER_ID_${Date.now()}`;

      await db.collection('orders').doc(devOrderId.toString()).set({
        userId,
        created: Timestamp.now(),
        items: items || [],
        recipient: recipient || {},
        retail_costs: retail_costs || {},
        status: 'draft',
        fromLocalDev: true, // Marca per saber que és una comanda fictícia
      });

      return res.status(200).json({
        success: true,
        result: {
          id: devOrderId,
          status: 'draft',
        },
      });
    }

    // ========================= MODE PRODUCCIÓ: CREEM A PRINTFUL =========================
    const orderPayload = {
      recipient,
      items: items.map(item => ({
        sync_variant_id: item.sync_variant_id,
        quantity: item.quantity,
      })),
      currency: 'EUR',
      locale: 'en_US',
    };
    if (retail_costs) {
      orderPayload.retail_costs = retail_costs;
    }

    const createResponse = await printfulFetch('orders', 'POST', orderPayload);
    const draftOrder = createResponse.result;
    const orderId = draftOrder.id;

    // Desa la comanda real a Firestore
    await db.collection('orders').doc(orderId.toString()).set({
      userId,
      created: Timestamp.now(),
      dashboard_url: draftOrder.dashboard_url,
      items: draftOrder.items || [],
      recipient: draftOrder.recipient || {},
      retail_costs: draftOrder.retail_costs || {},
      pricing_breakdown: draftOrder.pricing_breakdown || {},
      shipping_service_name: draftOrder.shipping_service_name || '',
      status: draftOrder.status || 'draft',
    });

    res.status(200).json({
      success: true,
      result: {
        id: orderId,
        status: draftOrder.status, 
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * =====================================
 *  Confirmar Comanda (draft -> confirm)
 * =====================================
 * Endpoint separat on confirmem la comanda DESPRÉS de confirmar el pagament a Stripe
 */
app.post('/printful/confirm-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Missing orderId.' });
    }

    // <-- Si NO és producció, no confirmem res a Printful
    if (process.env.NODE_ENV !== 'production') {
      return res.status(400).json({
        success: false,
        error: 'Order confirmation is only allowed in production.',
      });
    }

    // PRODUCCIÓ: Confirmem la comanda a Printful
    const confirmEndpoint = `orders/${orderId}/confirm`;
    const confirmResponse = await printfulFetch(confirmEndpoint, 'POST');
    const confirmedOrder = confirmResponse.result;
    if (process.env.NODE_ENV !== 'production') {
      console.log("Confirmat a Printful, status actual:", confirmedOrder.status);
    }    

    await db.collection('orders').doc(orderId.toString()).update({
      status: 'confirmed',
      updated: Timestamp.now(),
    });

    res.status(200).json({
      success: true,
      message: 'Order confirmed successfully!',
      finalStatus: 'confirmed',
    });
  } catch (error) {
    console.error('Error confirmant la comanda (draft->confirm) a Printful:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ============================================
 *    Crear sessió de Stripe Checkout
 * ============================================
 */
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, shippingCost, orderId } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'No items provided.' });
    }
    if (!items.every(item => item.name && item.price >= 0 && item.quantity > 0)) {
      return res.status(400).json({ success: false, error: 'Invalid items data.' });
    }
    if (isNaN(shippingCost) || shippingCost < 0) {
      return res.status(400).json({ success: false, error: 'Invalid shipping cost.' });
    }

    // Line items en format que Stripe entén 
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));
    // Afegim una línia per a "Shipping Cost"
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Shipping Cost' },
        unit_amount: shippingCost,
      },
      quantity: 1,
    });

    // Determina la URL del frontend segons l'entorn
    const frontendUrl = process.env.NODE_ENV === 'production'
      ? secrets.FRONTEND_URL_PROD?.trim()
      : secrets.FRONTEND_URL?.trim();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${frontendUrl}/#/success?order_id=${orderId}`,
      cancel_url: `${frontendUrl}/#/cancel`,
    });

    res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('Error al crear la sessió Stripe:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ============================================
 *   Resta d'Endpoints Printful (estimates)
 * ============================================
 */
app.post('/printful/shipping-estimates', validateShippingRequest, async (req, res) => {
  try {
    const { recipient, items, currency = 'EUR', locale = 'en_US' } = req.body;

    const shippingInfo = {
      recipient: {
        ...recipient,
        phone: recipient.phone || '',
        state_code: recipient.state_code || '',
      },
      items: items.map(item => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        value: item.value,
      })),
      currency,
      locale,
    };

    const response = await fetch('https://api.printful.com/shipping/rates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secrets.PRINTFUL_API_KEY}`,
      },
      body: JSON.stringify(shippingInfo),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error resposta Printful API:', errorText);
      return res.status(500).json({ success: false, error: `Printful API Error: ${errorText}` });
    }

    const data = await response.json();
    res.status(200).json({ success: true, result: data.result });
  } catch (error) {
    console.error('Error obtenint tarifes d’enviament:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/printful/estimate-costs', validateShippingRequest, async (req, res) => {
  try {
    const { recipient, items } = req.body;
    const orderPayload = { recipient, items };
    const response = await printfulFetch('orders/estimate-costs', 'POST', orderPayload);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error al obtenir els costos estimats:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * ==================================
 *  Enviament de correus (Nodemailer)
 * ==================================
 */
app.post('/sendContactEmail', async (req, res) => {
  const { name, email, project } = req.body;

  if (!name || !email || !project) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: secrets.EMAIL_USER,
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nProject: ${project}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Project:</strong> ${project}</p>
    `,
  };

  try {
    if (!transporter) {
      throw new Error('Email transporter not configured.');
    }
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
});

/**
 * ===========================
 *  Endpoints de test
 * ===========================
 */
app.get('/test-secrets', async (req, res) => {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY_LIVE;
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    res.status(200).json({
      success: true,
      secrets: {
        STRIPE_SECRET_KEY_LIVE: stripeKey ? 'Carregada' : 'Missing',
        EMAIL_USER: emailUser ? 'Carregada' : 'Missing',
        EMAIL_PASS: emailPass ? 'Carregada' : 'Missing',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error en carregar els secrets.' });
  }
});

app.get('/test-email', async (req, res) => {
  try {
    if (!transporter) {
      throw new Error('Email transporter not configured.');
    }
    await transporter.sendMail({
      from: secrets.EMAIL_USER,
      to: secrets.EMAIL_USER,
      subject: 'Test Email',
      text: 'Aquest és un correu de prova!',
    });
    res.status(200).json({ success: true, message: 'Email enviat correctament!' });
  } catch (error) {
    console.error('Error enviant el correu:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===========================================================
   FUNCIÓ PROGRAMADA PER ENVIAR CORREUS DE SEGUIMENT
   =========================================================== */
exports.updateOrderTracking = onSchedule(
  {
    schedule: "0 */6 * * *", // Executar cada 6 hores
    timeZone: "Europe/Madrid",
  },
  async () => {
    //console.log("[updateOrderTracking] Iniciant tasca programada...");

    try {
      const ordersSnapshot = await db
        .collection("orders")
        .where("status", "==", "confirmed")
        .get();

      if (ordersSnapshot.empty) {
        //console.log("[updateOrderTracking] No hi ha comandes pendents.");
        return;
      }

      const promises = [];
      ordersSnapshot.forEach((doc) => {
        const promise = (async () => {
          const orderId = doc.id;
          const orderData = doc.data();

          // Crida Printful (només es farà en producció si la comanda realment existeix a Printful)
          const response = await fetch(`https://api.printful.com/orders/${orderId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${secrets.PRINTFUL_API_KEY}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`Error Printful API: ${response.status}`);
          }

          const data = await response.json();
          const printfulOrder = data.result;
          const shipment = printfulOrder.shipments?.[0];

          if (!shipment) {
            //console.log(`[updateOrderTracking] La comanda ${orderId} no té seguiment encara.`);
            return;
          }

          // Actualitzar Firestore
          await db.collection("orders").doc(orderId.toString()).update({
            tracking_number: shipment.tracking_number,
            tracking_url: shipment.tracking_url,
            carrier: shipment.carrier,
            status: printfulOrder.status,
            updated: admin.firestore.Timestamp.now(),
          });

          // Només enviem correu si la comanda té un nou status
          if (orderData.last_notified_status !== printfulOrder.status) {
            const emailData = {
              recipientName: orderData.recipient?.name || "Client",
              orderId,
              trackingNumber: shipment.tracking_number,
              trackingUrl: shipment.tracking_url,
              carrier: shipment.carrier,
              items: printfulOrder.items
            };

            // Renderitzem la plantilla ejs
            const html = await ejs.renderFile(
              path.resolve(__dirname, "templates/emailTemplate.ejs"),
              emailData
            );

            // Enviem correu
            await transporter.sendMail({
              from: `"AborrasDesign" <${secrets.EMAIL_USER}>`,
              to: orderData.recipient?.email,
              subject: `Estat de la teva comanda #${orderId}`,
              html,
            });

            // Actualitzem last_notified_status
            await db.collection("orders").doc(orderId.toString()).update({
              last_notified_status: printfulOrder.status,
            });

            //console.log(`[updateOrderTracking] Correu enviat al client per la comanda ${orderId}.`);
          }
        })();
        promises.push(promise);
      });

      await Promise.all(promises);
      //console.log("[updateOrderTracking] Tasca completada.");
    } catch (error) {
      console.error("[updateOrderTracking] Error:", error.message);
    }
  }
);

// Endpoint de prova per renderitzar ejs
app.get("/test-render", async (req, res) => {
  try {
    // Dades de prova
    const emailData = {
      recipientName: "Anna Borràs Font",
      orderId: "115353929",
      trackingNumber: "0082800082808819464684",
      trackingUrl: "https://myorders.co/tracking/59613314/0082800082808819464684",
      carrier: "SPRING",
      items: [
        {
          id: 95603299,
          name: "Bauhaus / White / 12″×16″",
          quantity: 1,
          files: [
            {
              type: "default",
              preview_url: "https://files.cdn.printful.com/files/5b4/5b4ffa1407d70a30e91e16decb087b3f_preview.png",
            },
            {
              type: "preview",
              preview_url: "https://files.cdn.printful.com/files/4b6/4b6faabfa81563f88b63214ae48a0239_preview.png",
            }
          ]
        },
      ],
    };

    const html = await ejs.renderFile(
      path.resolve(__dirname, "templates/emailTemplate.ejs"),
      emailData
    );

    return res.status(200).send(html);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/**
 * ============================================
 *  Exportem l'app com Cloud Function Gen 2
 * ============================================
 */
exports.api = onRequest(app);
