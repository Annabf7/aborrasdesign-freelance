import React from "react";
import "../styles/GenerativeArtCustomization.css";

const GenerativeArtCustomization = ({ sketchName }) => {
  return (
    <div className="customization-container">
      <h2 className="customization-title">Customize {sketchName}</h2>
      <div className="customization-controls">
        <label htmlFor="colorScheme">Color Scheme:</label>
        <select id="colorScheme">
          <option value="Default">Default</option>
          <option value="Vibrant">Vibrant</option>
          <option value="Monochrome">Monochrome</option>
        </select>

        <label htmlFor="sizeFactor">Line Length Factor:</label>
        <input
          type="range"
          id="sizeFactor"
          min="0.5"
          max="2"
          step="0.1"
          onChange={(e) => {
            // Aquí podries ajustar la variable de mida directament en el sketch
          }}
        />
      </div>
      <button className="close-button" onClick={() => window.closeCustomization()}>
        Close
      </button>
    </div>
  );
};

export default GenerativeArtCustomization;
