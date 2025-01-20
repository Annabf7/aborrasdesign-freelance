// GenerativeLoader.jsx
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';


const GenerativeLoader = ({ onFinish }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let particles = [];
      const parNum = 500;
      let colors = [];
      let blobs = [];

      p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.RGB, 255, 255, 255, 255);
        p.noStroke();

        colors = [
          { color: p.color(215, 180, 106), weight: 1 }, // #D7B46A
          { color: p.color(236, 236, 236), weight: 1 }, // #ECECEC
          { color: p.color(30, 31, 31), weight: 3 },   // #1E1F1F
        ];

        for (let i = 0; i < parNum; i++) {
          particles.push(
            new Particle(p.random(p.width), p.random(p.height), colors, p)
          );
        }
        p.background(30, 31, 31);

        setInterval(() => {
          const color = getWeightedRandomColor(colors);
          const x = p.random(p.width);
          const y = p.random(p.height);
          drawBlob(x, y, color, p);
          blobs.push({ x, y, size: 80 });
        }, p.random(1000, 3000));
      };

      p.draw = function () {
        for (let j = particles.length - 1; j >= 0; j--) {
          if (!isInsideBlob(particles[j].x, particles[j].y)) {
            particles[j].update();
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
            p
          );
          if (!isInsideBlob(newParticle.x, newParticle.y)) {
            particles.push(newParticle);
          }
        }
      };

      function drawBlob(x, y, color, p) {
        p.push();
        p.fill(color);
        p.noStroke();
        const blobSize = p.random(50, 100);
        const points = p.random(8, 12);
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

      function isInsideBlob(x, y) {
        for (const blob of blobs) {
          const d = p.dist(x, y, blob.x, blob.y);
          if (d < blob.size / 2) {
            return true;
          }
        }
        return false;
      }

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
        return colors[colors.length - 1].color;
      }

      class Particle {
        constructor(x, y, colors, p) {
          this.x = x;
          this.y = y;
          this.p = p;
          this.lifespan = p.random(50, 150);
          this.size = p.random(3, 7);
          this.color = getWeightedRandomColor(colors);
        }

        update() {
          this.x += this.p.random(-2, 2);
          this.y += this.p.random(-2, 2);
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

  return <div ref={sketchRef} className="loader-container"></div>;
};

export default GenerativeLoader;
