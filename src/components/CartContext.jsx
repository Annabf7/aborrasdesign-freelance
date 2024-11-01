import React, { createContext, useState } from "react";

// Creem el context per al carretó
export const CartContext = createContext();

// Proveïdor del CartContext que embolicarà els components necessaris
export const CartProvider = ({ children }) => {
  // Definim l'estat per la quantitat d'articles
  const [quantity, setQuantity] = useState(1);

  // Proporcionem el valor del context amb la quantitat i la funció per modificar-la
  return <CartContext.Provider value={{ quantity, setQuantity }}>{children}</CartContext.Provider>;
};
