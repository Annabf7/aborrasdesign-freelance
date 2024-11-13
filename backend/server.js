// backend/server.js

require("dotenv").config(); // Importa dotenv
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Utilitza la clau de l'entorn
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Ruta per crear una sessió de pagament
app.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Stripe treballa en cèntims
        },
        quantity: item.quantity,
      })),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error al crear la sessió de pagament:", error);
    res.status(500).json({ error: "No s'ha pogut crear la sessió de pagament" });
  }
});

// Nova ruta per obtenir variants de Printful
app.get("/api/printful/products", async (req, res) => {
  const baseUrl = "https://api.printful.com/store/products";
  const accessToken = process.env.PRINTFUL_API_KEY;

  try {
    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data.result); // Envia la llista de productes sincronitzats al client
  } catch (error) {
    console.error("Error obtenint sync_variant_id:", error);
    res.status(500).json({ error: "No s'ha pogut obtenir les dades de Printful" });
  }
});

// Iniciar el servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor funcionant a http://localhost:${PORT}`);
});
