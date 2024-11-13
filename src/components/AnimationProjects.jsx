import React, { useState } from "react";
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
            <video
              key={index}
              className="motion-video"
              src={videoSrc}
              loop // Reprodueix en bucle
              autoPlay // Reprodueix automàticament
              muted // Sense so
              playsInline // Optimització per a dispositius mòbils
            />
          ))}
        </div>
      );
    }
    // Placeholder per a altres categories com "Web Frontend" i "Photography"
    else if (category === "Web Frontend") {
      return <p>Mostrant treballs de Web Frontend...</p>;
    } else if (category === "Photography") {
      return <p>Mostrant treballs de Fotografia...</p>;
    }
  };

  return (
    <div>
      {/* Filtratge de categories */}
      <div className="filter-container">
        <button onClick={() => setCategory("Motion")}>Motion</button>
        <button onClick={() => setCategory("Web Frontend")}>Web Frontend</button>
        <button onClick={() => setCategory("Photography")}>Photography</button>
      </div>

      {/* Contingut de la galeria segons la categoria */}
      {getCategoryContent()}
    </div>
  );
};

export default Gallery;
