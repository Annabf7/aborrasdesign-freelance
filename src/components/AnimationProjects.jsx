// src/components/Gallery.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AnimationProjects.css";

// Importa els vídeos de la categoria "Motion"
import motion_1 from "../assets/motion/motion_1.mp4";
import motion_2 from "../assets/motion/motion_2.mp4";
import motion_3 from "../assets/motion/motion_3.mp4";
import motion_4 from "../assets/motion/motion_4.mp4";
import motion_5 from "../assets/motion/motion_5.mp4";
import motion_6 from "../assets/motion/motion_6.mp4";
import motion_7 from "../assets/motion/motion_7.mp4";
import motion_8 from "../assets/motion/motion_8.mp4";
import motion_9 from "../assets/motion/motion_9.mp4";
import motion_10 from "../assets/motion/motion_10.mp4";
import motion_11 from "../assets/motion/motion_11.mp4";
import motion_12 from "../assets/motion/motion_12.mp4";

// Component principal
const Gallery = () => {
  const [category, setCategory] = useState("Motion"); // Categoria inicial
  const videoRefs = useRef([]); // Ref per a múltiples vídeos
  const navigate = useNavigate(); 

  // Vídeos de la categoria "Motion"
  const motionVideos = [
    motion_1,
    motion_2,
    motion_3,
    motion_4,
    motion_5,
    motion_6,
    motion_7,
    motion_8,
    motion_9,
    motion_10,
    motion_11,
    motion_12,
  ];

  // Contingut a mostrar segons la categoria seleccionada
  const getCategoryContent = () => {
    if (category === "Motion") {
      return (
        <div className="grid-gallery">
          {motionVideos.map((videoSrc, index) => (
            <div
              key={index}
              className="motion-item"
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                className="motion-video"
                src={videoSrc}
                loop // Reprodueix en bucle
                autoPlay // Reprodueix automàticament
                muted // Sense so per defecte
                playsInline // Optimització per a dispositius mòbils
              />
            </div>
          ))}
        </div>
      );
    } else {
      return <p>Selecciona una categoria per veure el contingut...</p>;
    }
  };

  // Funció per manejar l'entrada del ratolí
  const handleMouseEnter = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = false; // Activa el so
      video.play().catch((error) => {
        console.error("Error al reproduir el vídeo:", error);
      });
    }
    const motionItem = document.getElementsByClassName("motion-item")[index];
    if (motionItem) {
      motionItem.classList.add("enlarge");
    }
  };

  // Funció per manejar la sortida del ratolí
  const handleMouseLeave = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.muted = true; 
    }
    const motionItem = document.getElementsByClassName("motion-item")[index];
    if (motionItem) {
      motionItem.classList.remove("enlarge");
    }
  };

  return (
    <div>
      {/* Filtratge de categories */}
      <div className="filter-container">
        <button onClick={() => setCategory("Motion")}>Motion</button>
        <button onClick={() => navigate("/webfrontend")}>Web Frontend</button>
        <button onClick={() => navigate("/photography")}>Photography</button>
        <button onClick={() => navigate("/automationdesign")}>
          Automation Design
        </button>
      </div>

      {/* Contingut de la galeria segons la categoria */}
      {getCategoryContent()}
    </div>
  );
};

export default Gallery;
