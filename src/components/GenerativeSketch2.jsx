import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext";
import p5 from "p5";
import "../styles/GenerativeSketch.css";

const GenerativeSketchMondrian = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext);

  useEffect(() => {
    const sketch = (p) => {
      let colors = [];
      let grid = [];

      p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noLoop();
        p.rectMode(p.CORNER);

        // Definir colors Mondrian
        colors = [
          "#c24934", // Vermell
          "#27487b", // Blau
          "#d1d1cf", // Blanc
          "#d0ac4e", // Groc
          "#0f0e09", // Negre
        ];

        generateGrid();
      };

      p.draw = function () {
        p.background("#d1d1cf"); // Blanc trencat
        for (let cell of grid) {
          p.strokeWeight(8);
          p.stroke("#0f0e09");
          p.fill(cell.color);
          p.rect(cell.x, cell.y, cell.width, cell.height);
        }
      };

      p.mousePressed = function () {
        // En fer clic, generar una nova composició
        generateGrid();
        p.redraw();
      };

      function generateGrid() {
        grid = [];
        const minCellSize = p.random(50, 100); // Tamany mínim
        const maxCellSize = p.random(150, 300); // Tamany màxim

        for (let x = 0; x < p.width; ) {
          for (let y = 0; y < p.height; ) {
            const cellWidth = p.random([minCellSize, maxCellSize]);
            const cellHeight = p.random([minCellSize, maxCellSize]);

            // Evitar que les cel·les surtin del canvas
            if (x + cellWidth > p.width) break;
            if (y + cellHeight > p.height) break;

            const color = p.random(colors);

            grid.push({
              x,
              y,
              width: cellWidth,
              height: cellHeight,
              color,
            });

            y += cellHeight; // Moure's al següent rectangle vertical
          }
          x += p.random([minCellSize, maxCellSize]); // Moure's al següent rectangle horitzontal
        }
      }

      // Ajustar canvas en redimensionar finestra
      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        generateGrid();
        p.redraw();
      };
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  const handleFinish = () => {
    const canvasElement = sketchRef.current.querySelector("canvas");
    const base64Image = canvasElement.toDataURL("image/png");
    setArtworkImage(base64Image);
    navigate("/choose-your-artwork-size");
  };

  return (
    <div className="generative-sketch-container">
      <div ref={sketchRef}></div>
      <button onClick={handleFinish} className="finish-button">
        Finish Personalization
      </button>
    </div>
  );
};

export default GenerativeSketchMondrian;
