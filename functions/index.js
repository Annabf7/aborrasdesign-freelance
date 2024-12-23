// index.js
const dotenv = require('dotenv');
const { onRequest } = require('firebase-functions/v2/https'); // Importa només onRequest
const admin = require("firebase-admin");
const { Timestamp } = require('firebase-admin/firestore');
const express = require("express");
const cors = require("cors");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const Stripe = require("stripe");
const path = require('path'); 
const nodemailer = require("nodemailer");
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// Inicialitza admin
admin.initializeApp();

const db = admin.firestore();

// Inicialitza Secret Manager client
const client = new SecretManagerServiceClient();

// Objecte per emmagatzemar les secrets carregades
const secrets = {};

// Variables globals per a Stripe i Nodemailer
let stripe;
let transporter;

// Funció per accedir a una secret
async function accessSecret(secretName) {
  const [version] = await client.accessSecretVersion({
    name: secretName,
  });
  return version.payload.data.toString('utf8');
}

// Funció per carregar totes les secrets
const loadSecrets = async () => {
  if (process.env.NODE_ENV === 'production') {
    // En producció, accedeix a les secrets des de Secret Manager
    secrets.FRONTEND_URL = await accessSecret('projects/aborrasdesign-b281d/secrets/FRONTEND_URL_PROD/versions/latest');
    secrets.PRINTFUL_API_KEY = await accessSecret('projects/aborrasdesign-b281d/secrets/PRINTFUL_API_KEY/versions/latest');
    secrets.STRIPE_SECRET_KEY_TEST = await accessSecret('projects/aborrasdesign-b281d/secrets/STRIPE_SECRET_KEY_TEST/versions/latest');
    secrets.STRIPE_SECRET_KEY_LIVE = await accessSecret('projects/aborrasdesign-b281d/secrets/STRIPE_SECRET_KEY_LIVE/versions/latest');
    secrets.EMAIL_USER = await accessSecret('projects/aborrasdesign-b281d/secrets/EMAIL_USER/versions/latest');
    secrets.EMAIL_PASS = await accessSecret('projects/aborrasdesign-b281d/secrets/EMAIL_PASS/versions/latest');
  } else {
    // En desenvolupament, carrega les secrets des de les variables d'entorn
    dotenv.config({ path: path.resolve(__dirname, '.env.development') });
    
    secrets.FRONTEND_URL = process.env.FRONTEND_URL || process.env.FRONTEND_URL_DEV;
    secrets.PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
    secrets.STRIPE_SECRET_KEY_TEST = process.env.STRIPE_SECRET_KEY_TEST;
    secrets.STRIPE_SECRET_KEY_LIVE = process.env.STRIPE_SECRET_KEY_LIVE;
    secrets.EMAIL_USER = process.env.EMAIL_USER;
    secrets.EMAIL_PASS = process.env.EMAIL_PASS;
  }

  // Inicialitza Stripe només si stripeSecretKey està present
  if (secrets.STRIPE_SECRET_KEY_LIVE || secrets.STRIPE_SECRET_KEY_TEST) {
    const stripeKey = process.env.NODE_ENV === 'production' ? secrets.STRIPE_SECRET_KEY_LIVE : secrets.STRIPE_SECRET_KEY_TEST;
    stripe = new Stripe(stripeKey);
    console.log('Stripe inicialitzat correctament.');
  } else {
    console.error("Stripe secret key is missing! Verifica la configuració.");
  }

  // Configura Nodemailer transporter
  if (secrets.EMAIL_USER && secrets.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'Gmail', // Pots utilitzar altres serveis com 'Yahoo', 'Outlook', etc.
      auth: {
        user: secrets.EMAIL_USER,
        pass: secrets.EMAIL_PASS,
      },
    });

    // Verificació del transporter
    try {
      await transporter.verify();
      console.log('Servidor preparat per rebre missatges');
    } catch (error) {
      console.error('Error configurant el transporter:', error);
    }
  } else {
    console.error("Email credentials are missing! Verifica la configuració.");
  }
};

// Carrega les secrets en inici
const secretsLoaded = loadSecrets();

// Middleware per assegurar que les secrets estan carregades
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Inicialitza l'aplicació Express
const app = express();

// Configura CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? secrets.FRONTEND_URL : 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Middleware per assegurar que les secrets estan carregades
app.use(asyncHandler(async (req, res, next) => {
  await secretsLoaded;
  next();
}));

// Middleware d'error
app.use((err, req, res, next) => {
  const allowedOrigin = process.env.NODE_ENV === 'production' ? secrets.FRONTEND_URL : 'http://localhost:3000';
  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

// Endpoint base
app.get('/', (req, res) => res.send('Backend està funcionant correctament!'));

// Funcions centralitzades per a Printful
async function printfulFetch(endpoint, method = 'GET', body = null) {
  if (!secrets.PRINTFUL_API_KEY) {
    throw new Error('PRINTFUL_API_KEY is missing.');
  }

  const url = `https://api.printful.com/${endpoint}`;
  const headers = {
    Authorization: `Bearer ${secrets.PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json',
  };
  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Printful API Error: ${response.status} - ${response.statusText} - ${errorText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    throw new Error(`Error parsing JSON response from Printful API (${endpoint}): ${jsonError.message}`);
  }

  return data;
}

async function getProductsFromPrintful() {
  const data = await printfulFetch('store/products');
  return data.result;
}

async function getProductDetailsFromPrintful(productId) {
  const endpoint = `store/products/${productId}`;
  const data = await printfulFetch(endpoint);
  return data.result;
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
    return res.status(400).json({ success: false, error: 'Invalid request format.' });
  }
  next();
}

// Routes Printful
app.get('/printful/products', async (req, res) => {
  try {
    const products = await getProductsFromPrintful();
    res.json(products);
  } catch (error) {
    console.error('Error obtenint els productes:', error.message);
    res.status(500).json({ error: "No s'han pogut obtenir els productes." });
  }
});

app.get('/printful/products/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const productDetails = await getProductDetailsFromPrintful(productId);
    res.json(productDetails);
  } catch (error) {
    console.error(`Error obtenint el producte ${productId}:`, error.message);
    res.status(500).json({ error: "No s'han pogut obtenir els detalls del producte." });
  }
});

app.get('/printful/orders', async (req, res) => {
  try {
    const data = await printfulFetch('orders');
    res.status(200).json({ success: true, orders: data.result });
  } catch (error) {
    console.error('Error obtenint les comandes:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/printful/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const data = await printfulFetch(`orders/${orderId}`);
    res.status(200).json({ success: true, order: data.result });
  } catch (error) {
    console.error(`Error obtenint la comanda ${orderId}:`, error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Crear sessió Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, shippingCost, orderId } = req.body;

    // Validacions dels items
    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'No items provided.' });
    }

    if (!items.every(item => item.name && item.price > 0 && item.quantity > 0)) {
      return res.status(400).json({ success: false, error: 'Invalid items data.' });
    }

    // Validació del cost d'enviament
    if (isNaN(shippingCost) || shippingCost <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid shipping cost.' });
    }

    // Construcció dels items per a Stripe (en cèntims)
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: item.price, 
      },
      quantity: item.quantity,
    }));

    // Afegim el cost d'enviament com a línia separada (en cèntims)
    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Shipping Cost' },
        unit_amount: shippingCost,
      },
      quantity: 1,
    });

    // Crear sessió de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Tipus de pagament acceptats
      line_items: lineItems, // Items que es mostren a Stripe
      mode: 'payment', // Mode de pagament únic
      success_url: `${FRONTEND_URL}/#/success?order_id=${orderId}`, // URL de retorn quan el pagament té èxit
      cancel_url: `${FRONTEND_URL}/#/cancel`, // URL de retorn quan es cancel·la el pagament
    });

    // Retornem l'ID de la sessió creada
    res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('Error al crear la sessió de Stripe:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

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

app.post('/printful/create-order', async (req, res) => {
  try {
    const { recipient, items, userId, retail_costs } = req.body;

    if (!recipient || !items || items.length === 0 || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: Missing recipient, items data or userId.',
      });
    }

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
      orderPayload.retail_costs = {
        currency: 'EUR',
        discount: retail_costs.discount,
        subtotal: retail_costs.subtotal,
        shipping: retail_costs.shipping,
        tax: retail_costs.tax,
        total: retail_costs.total
      };
    }

    const response = await printfulFetch('orders', 'POST', orderPayload);

    const data = response; // Ya has parsejat JSON en printfulFetch
    console.log('Comanda creada amb èxit:', data);

    const orderId = data.result.id;
    const orderDocRef = db.collection('orders').doc(orderId.toString());

    await orderDocRef.set({
      userId: userId,
      created: Timestamp.now(),
      dashboard_url: data.result.dashboard_url,
      items: data.result.items.map(i => {
        let thumb = '';
        const previewFile = i.files.find(f => f.type === 'preview');
        if (previewFile && previewFile.thumbnail_url) {
          thumb = previewFile.thumbnail_url;
        } else {
          const defaultFile = i.files.find(f => f.type === 'default' && f.thumbnail_url);
          if (defaultFile) {
            thumb = defaultFile.thumbnail_url;
          }
        }

        return {
          sync_variant_id: i.sync_variant_id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.product.image,
          thumbnail_url: thumb
        };
      }),
      recipient: {
        name: data.result.recipient.name,
        address1: data.result.recipient.address1,
        city: data.result.recipient.city,
        country_code: data.result.recipient.country_code,
        email: data.result.recipient.email,
        phone: data.result.recipient.phone,
        zip: data.result.recipient.zip
      },
      retail_costs: data.result.retail_costs,
      pricing_breakdown: data.result.pricing_breakdown,
      shipping_service_name: data.result.shipping_service_name,
      status: data.result.status,
    });

    res.status(200).json({ success: true, result: data.result });
  } catch (error) {
    console.error('Error creant la comanda a Printful:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/printful/estimate-costs', validateShippingRequest, async (req, res) => {
  try {
    const { recipient, items } = req.body;
    const orderPayload = { recipient, items };

    const response = await printfulFetch('orders/estimate-costs', 'POST', orderPayload);

    const data = response; // Ya has parsejat JSON en printfulFetch
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtenir els costos estimats:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Funció per enviar l'email de contacte
app.post('/sendContactEmail', async (req, res) => {
  const { name, email, project } = req.body;

  // Validació dels camps necessaris
  if (!name || !email || !project) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  // Configuració de les opcions del correu
  const mailOptions = {
    from: `"${name}" <${email}>`, // L'usuari que envia el correu
    to: secrets.EMAIL_USER, // La teva adreça de correu per rebre els missatges
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

// Exportar l'aplicació Express com a Cloud Function amb GCF Gen 2
exports.api = onRequest(app);
