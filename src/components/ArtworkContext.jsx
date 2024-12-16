// ArtworkContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ArtworkContext = createContext();

export const ArtworkProvider = ({ children }) => {
  const [artworkImage, setArtworkImage] = useState(null);

  useEffect(() => {
    console.log('ArtworkImage actualitzat:', artworkImage);
  }, [artworkImage]);

  return (
    <ArtworkContext.Provider value={{ artworkImage, setArtworkImage }}>
      {children}
    </ArtworkContext.Provider>
  );
};
