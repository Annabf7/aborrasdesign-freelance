import React, { useEffect, useState } from 'react';
import '../styles/GenerativeArtGallery.css';
import { Link } from 'react-router-dom';

// Importem les imatges dels estils d'art generatiu
import style1 from '../assets/generative/style_1.png';
import style2 from '../assets/generative/style_2.png';
import style3 from '../assets/generative/style_3.png';
import style4 from '../assets/generative/style_4.png';
import style5 from '../assets/generative/style_5.png';
import style6 from '../assets/generative/style_6.png';
import style7 from '../assets/generative/style_7.png';
import style8 from '../assets/generative/style_8.png';

const GenerativeArtGallery = () => {
  const [showModal, setShowModal] = useState(false);

  // Dades dels estils d'art generatiu
  const artStyles = [
    { id: 368460597, img: style1, name: 'Expressionism' },
    { id: 368460811, img: style2, name: 'De Stijl' },
    { id: 368460959, img: style3, name: 'Surrealism' },
    { id: 368461089, img: style4, name: 'Pop art' },
    { id: 368461819, img: style5, name: 'Cubism' },
    { id: 368461953, img: style6, name: 'Constructivism' },
    { id: 368462117, img: style7, name: 'Kinetic Art' },
    { id: 368462348, img: style8, name: 'Bauhaus' },
  ];

  // Precarrega d'imatges per optimitzar l'experiència de l'usuari
  useEffect(() => {
    artStyles.forEach((style) => {
      const img = new Image();
      img.src = style.img;
    });
  }, []); // És segur ignorar artStyles perquè no canvia mai

  // Comprovació si no hi ha estils disponibles
  if (artStyles.length === 0) {
    return <p>No generative art styles available at the moment.</p>;
  }

  return (
    <div className="generative-gallery-container">
      <div className="gallery-header">
        <h1 className="gallery-title">Generative Art Gallery: Art movements</h1>
        <button
          className="video-presentation-button"
          onClick={() => setShowModal(true)}
        >
          Video Presentation
        </button>
      </div>
      <div className="gallery-grid">
        {artStyles.map((style) => {
          if (!style.id || !style.img || !style.name) {
            console.warn('Estil incomplet detectat:', style);
            return null;
          }
          return (
            <div key={style.id} className="gallery-item">
              <Link
                to={`/choose-your-artwork-size/${style.id}`}
                state={{ name: style.name, img: style.img }}
              >
                <img
                  src={style.img}
                  alt={style.name}
                  className="generative-gallery-image"
                />
                <p>{style.name}</p>
              </Link>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="generative-modal-overlay">
          <div className="generative-modal-content">
            <button
              className="generative-modal-close"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <video
              className="generative-modal-video"
              controls
              autoPlay
              controlsList="nodownload nofullscreen"
              disablePictureInPicture
              src="https://firebasestorage.googleapis.com/v0/b/aborrasdesign-b281d.firebasestorage.app/o/presentationArtGen.mp4?alt=media&token=13ed28e5-ec19-40d1-ba19-8fcc2ae290e8"
            />

          </div>
        </div>
      )}
    </div>
  );
};

export default GenerativeArtGallery;
