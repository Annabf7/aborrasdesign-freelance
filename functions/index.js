// index.js a la carpeta functions
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
const Stripe = require("stripe");

// Inicialitza admin (ja no necessites serviceAccountKey.json a codi, les credencials venen de l'entorn):
admin.initializeApp();
const db = admin.firestore();

// Obtenim les variables d'entorn definides a Firebase
// Les hauràs definit amb firebase functions:config:set ...
const printfulApiKey = functions.config().printful.api_key;
const stripeSecretKey = functions.config().stripe.secret_key;

// Pots definir una lògica per triar FRONTEND_URL segons entorn (dev o prod):
// Ex:
// const FRONTEND_URL = (process.env.NODE_ENV === 'production') 
//   ? functions.config().frontend.prod.url 
//   : functions.config().frontend.dev.url;

const FRONTEND_URL = functions.config().frontend.prod.url || "https://www.aborrasdesign.com";
// Si vols treballar en local, pots canviar FRONTEND_URL segons un paràmetre, o simplement
// comentar i descomentar segons necessitis.
// Per testejar localment (amb emuladors), pots posar: const FRONTEND_URL = functions.config().frontend.dev.url || "http://localhost:3000";

const stripe = new Stripe(stripeSecretKey);

// printfulApi.js integrat aquí mateix per simplicitat
async function printfulFetch(endpoint, method = 'GET', body = null) {
  if (!printfulApiKey) {
    throw new Error('PRINTFUL_API_KEY is missing from environment variables.');
  }

  const url = `https://api.printful.com/${endpoint}`;
  const headers = {
    Authorization: `Bearer ${printfulApiKey}`,
    'Content-Type': 'application/json',
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(url, options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Printful API Error: ${response.status} - ${response.statusText} - ${errorText}`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    throw new Error(
      `Error parsing JSON response from Printful API (${endpoint}): ${jsonError.message}`
    );
  }

  return data;
}

async function getProductsFromPrintful() {
  const data = await printfulFetch('store/products');
  return data.result;
}

async function getProductDetailsFromPrintful(productId) {
  const endpoint = `https://api.printful.com/store/products/${productId}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${printfulApiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Printful API Error: ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.result;
}

// Express app setup
const app = express();
app.use(cors({ origin: FRONTEND_URL, methods: ['GET', 'POST'] }));
app.use(express.json());

// Middleware d'error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error.' });
});

// Endpoint base
app.get('/', (req, res) => res.send('Backend està funcionant correctament!'));

// Validació shipping request
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

// Funció auxiliar per fer GET a Printful ja integrat a printfulFetch
async function printfulGet(endpoint) {
  const data = await printfulFetch(endpoint, 'GET');
  return data;
}

// Routes Printful
app.get('/api/printful/products', async (req, res) => {
  try {
    const products = await getProductsFromPrintful();
    res.json(products);
  } catch (error) {
    console.error('Error obtenint els productes:', error.message);
    res.status(500).json({ error: "No s'han pogut obtenir els productes." });
  }
});

app.get('/api/printful/products/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const productDetails = await getProductDetailsFromPrintful(productId);
    res.json(productDetails);
  } catch (error) {
    console.error(`Error obtenint el producte ${productId}:`, error.message);
    res.status(500).json({ error: "No s'han pogut obtenir els detalls del producte." });
  }
});

app.get('/api/printful/orders', async (req, res) => {
  try {
    const data = await printfulGet('orders');
    res.status(200).json({ success: true, orders: data.result });
  } catch (error) {
    console.error('Error obtenint les comandes:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/printful/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const data = await printfulGet(`orders/${orderId}`);
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

    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'No items provided.' });
    }

    if (!items.every(item => item.name && item.price > 0 && item.quantity > 0)) {
      return res.status(400).json({ success: false, error: 'Invalid items data.' });
    }

    if (isNaN(shippingCost) || shippingCost <= 0) {
      return res.status(400).json({ success: false, error: 'Invalid shipping cost.' });
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'eur',
        product_data: { name: item.name },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    lineItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Shipping Cost' },
        unit_amount: shippingCost,
      },
      quantity: 1,
    });

    // FRONTEND_URL ja definit a dalt
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${FRONTEND_URL}/#/success?order_id=${orderId}`,
      cancel_url: `${FRONTEND_URL}/#/cancel`,
    });

    res.status(200).json({ success: true, sessionId: session.id });
  } catch (error) {
    console.error('Error al crear la sessió de Stripe:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/printful/shipping-estimates', validateShippingRequest, async (req, res) => {
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
        Authorization: `Bearer ${printfulApiKey}`,
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

app.post('/api/printful/create-order', async (req, res) => {
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

    const response = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${printfulApiKey}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error resposta Printful API:', errorText);
      return res.status(500).json({ success: false, error: `Printful API Error: ${errorText}` });
    }

    const data = await response.json();
    console.log('Comanda creada amb èxit:', data);

    const orderId = data.result.id;
    const orderDocRef = db.collection('orders').doc(orderId.toString());

    await orderDocRef.set({
      userId: userId,
      created: admin.firestore.Timestamp.now(),
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

app.post('/api/printful/estimate-costs', validateShippingRequest, async (req, res) => {
  try {
    const { recipient, items } = req.body;
    const orderPayload = { recipient, items };

    const response = await fetch('https://api.printful.com/orders/estimate-costs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${printfulApiKey}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error resposta Printful API:', errorText);
      return res.status(500).json({ success: false, error: `Printful API Error: ${errorText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error al obtenir els costos estimats:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Finalment exportem la funció:
exports.api = functions.https.onRequest(app);
