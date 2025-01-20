// ShippingContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const ShippingContext = createContext();

export const ShippingProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState(() => {
    const savedAddress = localStorage.getItem('userAddress');
    return savedAddress
      ? JSON.parse(savedAddress)
      : {
          email: '',
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          state: '',
          country: '',
          postalCode: '',
          phone: '',
        };
  });

  const [shippingCost, setShippingCost] = useState(0);

  useEffect(() => {
    // Validem l'adreça abans de guardar-la
    if (
      userAddress.firstName &&
      userAddress.lastName &&
      userAddress.address &&
      userAddress.city &&
      userAddress.postalCode &&
      userAddress.country
    ) {
      localStorage.setItem('userAddress', JSON.stringify(userAddress));
    } else {
      console.warn('Adreça incompleta o falta nom complet, no desada al localStorage:', userAddress);
    }
  }, [userAddress]);

  const getRecipientForPrintful = () => {
    const { firstName, lastName, address, city, state, country, postalCode, phone, email } = userAddress;

    // Validem els camps obligatoris
    if (!firstName || !lastName || !address || !city || !country || !postalCode) {
      console.error('Falten camps obligatoris per enviar:', {
        firstName,
        lastName,
        address,
        city,
        country,
        postalCode,
      });
      return null;
    }

    // Mapeig de codis de país
    const countryMap = {
      España: 'ES',
      Spain: 'ES',
      France: 'FR',
      Germany: 'DE',
      Italia: 'IT',
      Italy: 'IT',
      'United States': 'US',
      USA: 'US',
      'Regne Unit': 'GB',
      UK: 'GB',
      Portugal: 'PT',
      Andorra: 'AD',
      México: 'MX',
      Mexico: 'MX',
      Argentina: 'AR',
    };
    const countryCode = countryMap[country] || country;

    // Creem l'objecte recipient
    const recipient = {
      name: `${firstName} ${lastName}`, // Combina el nom i el cognom
      address1: address,
      city,
      country_code: countryCode,
      zip: postalCode,
      phone: phone || '',
      email,
    };

    if (['US', 'CA', 'AU'].includes(countryCode)) {
      recipient.state_code = state || '';
      if (!state) {
        console.warn(`El país ${country} requereix un estat, però està buit.`);
      }
    }

    //console.log('Recipient generat:', recipient);
    return recipient;
  };

  return (
    <ShippingContext.Provider
      value={{
        userAddress,
        setUserAddress,
        getRecipientForPrintful,
        shippingCost,
        setShippingCost,
      }}
    >
      {children}
    </ShippingContext.Provider>
  );
};
