import { createContext, useState } from "react";

export const ShippingContext = createContext();

export const ShippingProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState({});

  return (
    <ShippingContext.Provider value={{ userAddress, setUserAddress }}>
      {children}
    </ShippingContext.Provider>
  );
};
