import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext"; // Importem el context
import p5 from "p5";
import "../styles/GenerativeSketch.css";

const GenerativeSketch5 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext); // Utilitzem el context per emmagatzemar la imatge

  useEffect(() => {
    const sketch = (p) => {
      let circles = [];

      p.setup = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.createCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);

        for (let i = 0; i < 20; i++) {
          circles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            r: p.random(10, 50),
            speedX: p.random(-2, 2),
            speedY: p.random(-2, 2),
            color: [p.random(255), p.random(255), p.random(255)],
          });
        }
      };

      p.windowResized = function () {
        const navHeight = document.querySelector("nav")
          ? document.querySelector("nav").offsetHeight
          : 0;
        const footerHeight = document.querySelector("footer")
          ? document.querySelector("footer").offsetHeight
          : 0;
        p.resizeCanvas(p.windowWidth, p.windowHeight - navHeight - footerHeight);
      };

      p.draw = function () {
        p.background(0);

        circles.forEach((circle) => {
          p.fill(circle.color);
          p.noStroke();
          p.ellipse(circle.x, circle.y, circle.r);
          circle.x += circle.speedX;
          circle.y += circle.speedY;
          if (circle.x > p.width || circle.x < 0) circle.speedX *= -1;
          if (circle.y > p.height || circle.y < 0) circle.speedY *= -1;
        });
      };

      p.captureImage = function () {
        const base64Image = p.canvas.toDataURL();
        return base64Image;
      };
    };

    let p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  const handleFinish = () => {
    const canvasElement = sketchRef.current.querySelector("canvas");
    const base64Image = canvasElement.toDataURL("image/png");
    setArtworkImage(base64Image); // Emmagatzema la imatge al context
    navigate("/choose-your-artwork-size");
  };

  return (
    <div>
      <div ref={sketchRef}></div>
      <button onClick={handleFinish} className="finish-button">
        Finish Personalization
      </button>
    </div>
  );
};

export default GenerativeSketch5;
