import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArtworkContext } from './ArtworkContext';
import p5 from 'p5';
import '../styles/GenerativeSketch.css';

const GenerativeSketch1 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext);

  useEffect(() => {
    const sketch = (p) => {
      let particles = [];
      const parNum = 1000;
      let colors = [];
      let deform = false;
      let blobs = []; // Contindrà les taques creades

      p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.RGB, 255, 255, 255, 255);
        p.noStroke();

        colors = [
          { color: p.color(215, 180, 106), weight: 1 }, // #D7B46A
          { color: p.color(236, 236, 236), weight: 1 }, // #ECECEC
          { color: p.color(30, 31, 31), weight: 3 }, // #1E1F1F (Més probabilitat)
        ];

        for (let i = 0; i < parNum; i++) {
          particles.push(
            new Particle(p.random(p.width), p.random(p.height), colors, p),
          );
        }
        p.background(30, 31, 31);
      };

      p.draw = function () {
        for (let j = particles.length - 1; j >= 0; j--) {
          if (!isInsideBlob(particles[j].x, particles[j].y)) {
            particles[j].update(deform);
            particles[j].show();
          }
          if (particles[j].finished()) {
            particles.splice(j, 1);
          }
        }

        while (particles.length < parNum) {
          const newParticle = new Particle(
            p.random(p.width),
            p.random(p.height),
            colors,
            p,
          );
          if (!isInsideBlob(newParticle.x, newParticle.y)) {
            particles.push(newParticle);
          }
        }
      };

      // Crear una taca quan es fa clic
      p.mousePressed = function () {
        const color = getWeightedRandomColor(colors);
        drawBlob(p.mouseX, p.mouseY, color, p);
        blobs.push({ x: p.mouseX, y: p.mouseY, size: 80 }); // Mida reduïda
      };

      // Alternar deformació amb l'espai
      p.keyPressed = function () {
        if (p.key === ' ') {
          deform = !deform;
        }
      };

      // Ajustar mida del canvas
      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(30, 31, 31);
      };

      // Dibuixar una taca amb contorns suaus i irregulars
      function drawBlob(x, y, color, p) {
        p.push();
        p.fill(color);
        p.noStroke();
        const blobSize = p.random(50, 100); // Mida reduïda
        const points = p.random(8, 12); // Punts per formes més petites
        const variation = p.random(0.8, 1.2);

        p.beginShape();
        for (let i = 0; i < points; i++) {
          const angle = p.TWO_PI * (i / points);
          const radius = blobSize * p.random(variation - 0.2, variation + 0.2);
          const px = x + p.cos(angle) * radius;
          const py = y + p.sin(angle) * radius;
          p.curveVertex(px, py);
        }
        p.endShape(p.CLOSE);
        p.pop();
      }

      // Verificar si un punt és dins d'una taca
      function isInsideBlob(x, y) {
        for (const blob of blobs) {
          const d = p.dist(x, y, blob.x, blob.y);
          if (d < blob.size / 2) {
            return true;
          }
        }
        return false;
      }

      // Obtenir un color ponderat aleatoriament
      function getWeightedRandomColor(colors) {
        let totalWeight = 0;
        colors.forEach((c) => (totalWeight += c.weight));
        let randomValue = p.random(totalWeight);

        for (const c of colors) {
          if (randomValue < c.weight) {
            return c.color;
          }
          randomValue -= c.weight;
        }
        return colors[colors.length - 1].color; // Retornar l'últim per seguretat
      }

      // Classe de partícules
      class Particle {
        constructor(x, y, colors, p) {
          this.x = x;
          this.y = y;
          this.p = p;
          this.lifespan = p.random(50, 150);
          this.size = p.random(3, 7);
          this.color = getWeightedRandomColor(colors);
        }

        update(deform) {
          if (deform) {
            this.x += this.p.random(-10, 10);
            this.y += this.p.random(-10, 10);
          } else {
            this.x += this.p.random(-2, 2);
            this.y += this.p.random(-2, 2);
          }
          this.lifespan -= 1;
        }

        show() {
          this.p.fill(this.color);
          this.p.ellipse(this.x, this.y, this.size);
        }

        finished() {
          return this.lifespan <= 0;
        }
      }
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  const handleFinish = () => {
    const canvasElement = sketchRef.current.querySelector('canvas');
    const base64Image = canvasElement.toDataURL('image/png');
    setArtworkImage(base64Image);
    navigate('/choose-your-artwork-size');
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

export default GenerativeSketch1;
