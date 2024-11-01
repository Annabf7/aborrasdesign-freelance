import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/ViewInSpace.css";
import space from "../assets/space.jpg"; // Imatge per defecte
import { useNavigate } from "react-router-dom";

const ViewInSpace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artworkImage, artworkName } = location.state;

  const [uploadedImage, setUploadedImage] = useState(null);
  const [artworkStyle, setArtworkStyle] = useState({
    top: "50%", // Inicialitzem al centre
    left: "50%",
    width: "30%",
    transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
  });
  const [showArtwork, setShowArtwork] = useState(false);
  const [frameOption, setFrameOption] = useState("None");

  const containerRef = useRef(null); // Referència a la imatge contenedora

  // Detectar el moviment amb les fletxes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showArtwork) {
        setArtworkStyle((prevStyle) => {
          let newTop = parseFloat(prevStyle.top);
          let newLeft = parseFloat(prevStyle.left);

          const container = containerRef.current;
          const containerBounds = container.getBoundingClientRect();
          const artwork = container.querySelector(".artwork-in-space");
          const artworkBounds = artwork.getBoundingClientRect();

          switch (e.key) {
            case "ArrowUp":
              newTop = Math.max(newTop - 2, 0);
              break;
            case "ArrowDown":
              newTop = Math.min(newTop + 2, containerBounds.height - artworkBounds.height);
              break;
            case "ArrowLeft":
              newLeft = Math.max(newLeft - 2, 0);
              break;
            case "ArrowRight":
              newLeft = Math.min(newLeft + 2, containerBounds.width - artworkBounds.width);
              break;
            default:
              break;
          }
          return { ...prevStyle, top: `${newTop}px`, left: `${newLeft}px` };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showArtwork]);

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="view-in-space-container">
      <div className="upload-checkout-buttons">
        <button onClick={() => document.getElementById("fileInput").click()}>
          Upload your space
        </button>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          onChange={handleUploadImage}
        />

        <button onClick={() => navigate("/checkout")}>Checkout</button>

        <div className="tools-section">
          <div className="tool-btn">
            <button
              onClick={() =>
                setArtworkStyle({
                  ...artworkStyle,
                  transform: `scale(${
                    parseFloat(artworkStyle.transform.split("scale(")[1]) + 0.1
                  })`,
                })
              }
            >
              +
            </button>
            <span>Zoom In</span>
          </div>
          <div className="tool-btn">
            <button
              onClick={() =>
                setArtworkStyle({
                  ...artworkStyle,
                  transform: `scale(${
                    parseFloat(artworkStyle.transform.split("scale(")[1]) - 0.1
                  })`,
                })
              }
            >
              -
            </button>
            <span>Zoom Out</span>
          </div>
          <div className="tool-btn">
            <button
              onClick={() =>
                setArtworkStyle({
                  ...artworkStyle,
                  transform: `rotate(${
                    parseInt(artworkStyle.transform.split("rotate(")[1]) + 15
                  }deg)`,
                })
              }
            >
              ⟳
            </button>
            <span>Rotate</span>
          </div>
        </div>
      </div>

      {/* Aquí assegurem que l'obra s'integri dins de la imatge */}
      <div className="image-preview-section" ref={containerRef}>
        <div className="space-image-container">
          <img src={uploadedImage || space} alt="User's space" className="space-img" />

          <button onClick={() => setShowArtwork(true)} className="show-artwork-btn">
            Show Artwork
          </button>

          {showArtwork && (
            <div className="artwork-in-space-container">
              <img
                src={artworkImage}
                alt={artworkName}
                className="artwork-in-space"
                style={artworkStyle}
                draggable={false}
              />
            </div>
          )}
        </div>
      </div>

      <div className="frame-options">
        <h3>Frame Options</h3>
        <select value={frameOption} onChange={(e) => setFrameOption(e.target.value)}>
          <option value="None">None</option>
          <option value="Wood">Wood</option>
          <option value="Metal">Metal</option>
          <option value="Glass">Glass</option>
        </select>
      </div>
    </div>
  );
};

export default ViewInSpace;
