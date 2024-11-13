// printfulApi.js

// Funció per obtenir les variants sincronitzades
export const getSyncVariants = async () => {
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
    return data.result; // Retorna la llista de productes sincronitzats
  } catch (error) {
    console.error("Error obtenint sync_variant_id:", error);
  }
};

// Funció per enviar una comanda a Printful
export const fetchPrintful = async (orderData) => {
  const baseUrl = "https://api.printful.com/orders";
  const accessToken = process.env.PRINTFUL_API_KEY;

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data; // Retorna la resposta de la comanda
  } catch (error) {
    console.error("Error enviant comanda a Printful:", error);
  }
};
