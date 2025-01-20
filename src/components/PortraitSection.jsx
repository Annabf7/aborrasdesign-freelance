import React from "react";
import fannyImage from "../assets/fanny.jpg";
import pulseraImage from "../assets/pulsera.jpg";
import sheiImage from "../assets/shei_arrecada.jpg";
import "../styles/PortraitSection.css";

const imageDescriptions = [
  "Portrait of a women wearing a headscarf and golden earrings",
  "Close-up of a hand wearing a golden bracelet",
  "Women with a golden earring and hand on her neck",
];

// Image Gallery Component
const ImageGallery = () => {
  const images = [fannyImage, pulseraImage, sheiImage];

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <img
          key={index}
          className="gallery-image"
          src={image}
          alt={imageDescriptions[index]} 
        />
      ))}
    </div>
  );
};

// Portrait Section Component + cara somrient
const PortraitSection = () => {
  return (
    <>
      <ImageGallery />
      <div className="description-section">
        <p className="description-text">
          WORK ON PORTRAIT PHOTOGRAPHY AND LOW SATURATION, YOU WILL FIND ME HERE{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d7b46a"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-smile"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        </p>
      </div>
    </>
  );
};

export default PortraitSection;
