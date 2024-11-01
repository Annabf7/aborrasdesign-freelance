import React from "react";
import { Link } from "react-router-dom"; // Importa Link de react-router-dom
import "../App.css"; // Si tens estils globals
import "../styles/GenerativeArt.css"; // Estils específics per a aquesta secció
import generativeVideo from "../assets/generative/generative_2.mp4";

const GenerativeArt = () => {
  return (
    <section className="generative-art-section">
      {/* Vídeo en bucle */}
      <video className="generative-art-video" autoPlay loop muted>
        <source src={generativeVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Text amb enllaç */}
      <div className="generative-art-overlay">
        <h2 className="generative-art-title">
          <Link to="/generative-art">GENERATIVE ART</Link>
        </h2>
      </div>
    </section>
  );
};

export default GenerativeArt;
