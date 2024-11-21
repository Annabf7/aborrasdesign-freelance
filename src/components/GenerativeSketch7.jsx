import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext";
import { vertexShaderCode } from "../shaders/vertexShaderCode7"; // Importem vertex shader
import { fragmentShaderCode } from "../shaders/fragmentShaderCode7"; // Importem fragment shader
import p5 from "p5";
import "../styles/GenerativeSketch.css";

const GenerativeSketch7 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext);

  useEffect(() => {
    const sketch = (p) => {
      let theShader;
      let shaderBg;
      let params = { a: 15.5, b: 4.0, m: 3.0, n: 4.0 }; // Inicialització dels paràmetres

      p.preload = function () {
        theShader = p.createShader(vertexShaderCode.trim(), fragmentShaderCode.trim());
      };

      p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
        p.pixelDensity(1);
        shaderBg = p.createGraphics(p.windowWidth, p.windowHeight, p.WEBGL);

        // Event de clic per actualitzar els paràmetres
        p.canvas.addEventListener("click", () => {
          params.a = p.random(10.0, 20.0); // Valors aleatoris per 'a'
          params.b = p.random(2.0, 6.0); // Valors aleatoris per 'b'
          params.m = p.random(1.0, 5.0); // Valors aleatoris per 'm'
          params.n = p.random(1.0, 5.0); // Valors aleatoris per 'n'
        });
      };

      p.draw = function () {
        shaderBg.shader(theShader);

        const yMouse = (p.map(p.mouseY, 0, p.height, p.height, 0) / p.height) * 2 - 1;
        const xMouse = (p.mouseX / p.width) * 2 - 1;
        const normalizedXMouse = (xMouse * p.width) / p.height;

        // Passar els uniformes al shader
        theShader.setUniform("iResolution", [p.width, p.height]);
        theShader.setUniform("iTime", p.millis() / 1000.0);
        theShader.setUniform("iMouse", [normalizedXMouse, yMouse]);
        theShader.setUniform("a", params.a); // Paràmetre interactiu
        theShader.setUniform("b", params.b); // Paràmetre interactiu
        theShader.setUniform("m", params.m); // Paràmetre interactiu
        theShader.setUniform("n", params.n); // Paràmetre interactiu

        shaderBg.rect(0, 0, p.width, p.height);
        p.image(shaderBg, -p.width / 2, -p.height / 2, p.width, p.height);
      };

      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        shaderBg = p.createGraphics(p.windowWidth, p.windowHeight, p.WEBGL);
      };

      p.captureImage = function () {
        const base64Image = p.canvas.toDataURL();
        return base64Image;
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

export default GenerativeSketch7;
