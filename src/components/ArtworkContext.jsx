// ArtworkContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ArtworkContext = createContext();

export const ArtworkProvider = ({ children }) => {
  const [artworkImage, setArtworkImage] = useState(null);

  return (
    <ArtworkContext.Provider value={{ artworkImage, setArtworkImage }}>
      {children}
    </ArtworkContext.Provider>
  );
};
