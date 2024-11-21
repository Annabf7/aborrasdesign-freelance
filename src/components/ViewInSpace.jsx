import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/ViewInSpace.css";
import space from "../assets/space.jpg"; // Imatge per defecte
import { useNavigate } from "react-router-dom";

const ViewInSpace = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artworkImage, artworkName, frameOption } = location.state; // Afegim el frameOption aquí

  const [uploadedImage, setUploadedImage] = useState(null);
  const [artworkStyle, setArtworkStyle] = useState({
    top: "50%", // Inicialitzem al centre
    left: "50%",
    width: "30%",
    transform: "translate(-50%, -50%) rotate(0deg) scale(1)",
  });
  const [showArtwork, setShowArtwork] = useState(false);
  const [frame, setFrame] = useState(frameOption || "Black"); // Estableix el color de marc per defecte

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

  // Funció per canviar el color del marc
  const handleFrameChange = (e) => {
    setFrame(e.target.value);
  };

  // Genera la URL de la imatge segons el color del marc seleccionat
  const generateFrameImage = () => {
    if (frame === "Black") {
      return "https://files.cdn.printful.com/products/172/6883_1527683114.jpg"; // Exemple de marc negre
    } else if (frame === "White") {
      return "https://files.cdn.printful.com/products/172/10761_1565092757.jpg"; // Exemple de marc blanc
    } else if (frame === "Red Oak") {
      return "https://files.cdn.printful.com/products/172/15007_1651047527.jpg"; // Exemple de marc Red Oak
    }
    return ""; // Si no hi ha cap marc seleccionat, no mostrar imatge
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

      {/* Secció de selecció de marc */}
      <div className="frame-options">
        <h3>Frame Options</h3>
        <select value={frame} onChange={handleFrameChange}>
          <option value="Black">Black</option>
          <option value="Red Oak">Red Oak</option>
          <option value="White">White</option>
        </select>
      </div>

      {/* Secció de la imatge de la noia amb l'obra integrada dins del marc */}
      <div className="frame-with-artwork">
        <h4>Preview of your artwork with the selected frame:</h4>
        <img
          src={generateFrameImage()}
          alt={`${frame} frame with artwork`}
          className="frame-image"
        />
        {/*}
        <img
          src={artworkImage}
          alt={artworkName}
          className="artwork-in-frame"
          style={artworkStyle}
        />*/}
      </div>
    </div>
  );
};

export default ViewInSpace;
