import fetch from 'node-fetch';

// Funció genèrica per fer crides a l'API de Printful
const printfulFetch = async (endpoint, method = 'GET', body = null) => {
  // Validació de la clau d'API
  if (!process.env.PRINTFUL_API_KEY) {
    throw new Error('PRINTFUL_API_KEY is missing from environment variables.');
  }

  const url = `https://api.printful.com/${endpoint}`;
  const headers = {
    Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    // Crida a l'API de Printful
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Printful API Error: ${response.status} - ${response.statusText} - ${errorText}`
      );
    }

    // Validació de JSON a la resposta
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      throw new Error(
        `Error parsing JSON response from Printful API (${endpoint}): ${jsonError.message}`
      );
    }

    // Logs en entorns de desenvolupament
    if (process.env.NODE_ENV !== 'production') {
      console.log(`Resposta de l'API (${endpoint}):`, data);
    }

    return data;
  } catch (error) {
    // Registre detallat d'errors
    console.error(
      `Error in Printful API call (${method} ${endpoint}):`,
      error.message
    );
    throw error;
  }
};

// Funció per obtenir tots els productes de la botiga des de Printful
export const getProductsFromPrintful = async () => {
  try {
    const data = await printfulFetch('store/products');

    // Logs en entorns de desenvolupament
    if (process.env.NODE_ENV !== 'production') {
      console.log('Productes obtinguts de Printful:', data.result);
    }

    return data.result;
  } catch (error) {
    console.error('Error obtenint els productes de Printful:', error.message);
    throw error;
  }
};

// Funció per obtenir els detalls d'un producte específic per ID
export const getProductDetailsFromPrintful = async (productId) => {
  try {
    // Endpoint oficial de Printful
    const endpoint = `https://api.printful.com/store/products/${productId}`;
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Printful API Error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log(`Detalls del producte obtinguts:`, data.result);
    return data.result; // Retornem els detalls del producte
  } catch (error) {
    console.error(
      `Error obtenint el producte ${productId} de Printful:`,
      error.message
    );
    throw error;
  }
};

