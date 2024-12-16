import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/GenerativeArtSelection.css';

const GenerativeArtSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Rebrem les dades de l'estil seleccionat des de la pàgina anterior
  const selectedStyle = location.state?.selectedStyle;

  useEffect(() => {
    // Si no hi ha dades de l'estil seleccionat, redirigeix a la galeria
    if (!selectedStyle) {
      navigate('/generative-art');
    }
  }, [selectedStyle, navigate]);

  // Si no hi ha `selectedStyle`, no renderitzem el contingut fins que no redirigim
  if (!selectedStyle) {
    return null;
  }

  const handleFinishPersonalization = () => {
    // Redirigim a ChooseYourArtworkSize passant el productId com a paràmetre
    navigate(`/choose-your-artwork-size/${selectedStyle.id}`, {
      state: { selectedStyle },
    });
  };

  return (
    <div className="selection-container">
      <div className="selection-left">
        <h2 className="selection-title">Your Selection:</h2>
        <img
          src={selectedStyle.img}
          alt={`Selected Style ${selectedStyle.id}`}
          className="selection-thumbnail"
        />
        <h3 className="selection-style-name">{selectedStyle.name}</h3>

        <div className="instructions">
          <h4>Instructions:</h4>
          <ul>
            <li>Move the mouse to adjust the pattern intensity.</li>
            <li>Press the "C" key to change color schemes.</li>
            <li>
              Scroll the mouse wheel to adjust the speed of the animation.
            </li>
            <li>
              Press the spacebar to reset the sketch with random settings.
            </li>
          </ul>
        </div>
      </div>

      <div className="selection-right">
        <img
          src={selectedStyle.img}
          alt={`Large View of Style ${selectedStyle.id}`}
          className="selection-large-image"
        />
        <button onClick={handleFinishPersonalization} className="start-button">
          Finish personalization
        </button>
      </div>
    </div>
  );
};

export default GenerativeArtSelection;
