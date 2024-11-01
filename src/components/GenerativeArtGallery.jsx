import React from "react";
import "../styles/GenerativeArtGallery.css";
import { Link } from "react-router-dom";

// Importem les imatges dels estils d'art generatiu
import style1 from "../assets/generative/style_1.png";
import style2 from "../assets/generative/style_2.png";
import style3 from "../assets/generative/style_3.png";
import style4 from "../assets/generative/style_4.png";
import style5 from "../assets/generative/style_5.png";
import style6 from "../assets/generative/style_6.png";
import style7 from "../assets/generative/style_7.png";
import style8 from "../assets/generative/style_8.png";

const GenerativeArtGallery = () => {
  // Array amb les dades dels estils
  const artStyles = [
    { id: 1, img: style1, name: "Style 1", link: "/generative-art/style-1" },
    { id: 2, img: style2, name: "Style 2", link: "/generative-art/style-2" },
    { id: 3, img: style3, name: "Style 3", link: "/generative-art/style-3" },
    { id: 4, img: style4, name: "Style 4", link: "/generative-art/style-4" },
    { id: 5, img: style5, name: "Style 5", link: "/generative-art/style-5" },
    { id: 6, img: style6, name: "Style 6", link: "/generative-art/style-6" },
    { id: 7, img: style7, name: "Style 7", link: "/generative-art/style-7" },
    { id: 8, img: style8, name: "Style 8", link: "/generative-art/style-8" },
  ];

  return (
    <div className="generative-gallery-container">
      <h1 className="gallery-title">
        Interactive Generative Art:
        <span className="gallery-title2">Create Your Own Masterpiece</span>
      </h1>

      <div className="gallery-grid">
        {artStyles.map((style) => (
          <div key={style.id} className="gallery-item">
            <Link
              to="/generative-art/selection"
              state={{ selectedStyle: style }} // Passem l'estil seleccionat a través de state
            >
              <img src={style.img} alt={`Style ${style.id}`} className="generative-gallery-image" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenerativeArtGallery;
