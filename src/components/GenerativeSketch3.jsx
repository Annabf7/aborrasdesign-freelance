import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ArtworkContext } from "./ArtworkContext";
import p5 from "p5";
import "../styles/GenerativeSketch.css";

const GenerativeSketch3 = () => {
  const sketchRef = useRef();
  const navigate = useNavigate();
  const { setArtworkImage } = useContext(ArtworkContext);

  useEffect(() => {
    const sketch = (p) => {
      const colors = {
        red: p.color(195, 44, 20), // #c32c14
        darkGreen: p.color(10, 69, 56), // #0a4538
        black: p.color(3, 8, 6), // #030806
        beige: p.color(204, 184, 136), // #ccb888
        background: p.color(193, 173, 125), // #c1ad7d
        grey: p.color(52, 51, 52), //#343334
      };

      let spirals = [];
      let circles = [];
      let particles = [];
      let lines = [];
      let emitParticles = false;

      p.setup = function () {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.background(colors.background);
        p.noStroke();

        drawBackgroundShapes();
        drawCat();
      };

      p.draw = function () {
        // Dibuixar espirals
        for (let spiral of spirals) {
          drawSpiral(spiral.x, spiral.y, spiral.size);
        }

        // Dibuixar cercles
        for (let circle of circles) {
          p.fill(circle.color);
          p.ellipse(circle.x, circle.y, circle.size);
          p.noStroke();
        }

        // Dibuixar partícules
        if (emitParticles) {
          for (let i = 0; i < 5; i++) {
            particles.push(new Particle(p.mouseX, p.mouseY));
          }
        }

        for (let particle of particles) {
          particle.update();
          particle.display();
        }

        // Eliminar partícules que han perdut la seva vida
        particles = particles.filter((particle) => particle.lifespan > 0);

        // Dibuixar línies
        for (let line of lines) {
          p.stroke(colors.black);
          p.strokeWeight(2);
          p.line(line.x1, line.y1, line.x2, line.y2);
        }
      };

      const drawBackgroundShapes = () => {
        // Forma vermella
        p.fill(colors.red);
        p.beginShape();
        p.vertex(p.width / 2 - 200, p.height / 2 + 200);
        p.vertex(p.width / 2 - 50, p.height / 2 - 150);
        p.vertex(p.width / 2 + 250, p.height / 2);
        p.vertex(p.width / 2 + 50, p.height / 2 + 200);
        p.endShape(p.CLOSE);

        // Forma verda
        p.fill(colors.darkGreen);
        p.beginShape();
        p.vertex(p.width / 2 - 100, p.height / 2 - 300);
        p.vertex(p.width / 2 - 300, p.height / 2 - 50);
        p.vertex(p.width / 2 - 50, p.height / 2 + 150);
        p.vertex(p.width / 2 + 100, p.height / 2);
        p.endShape(p.CLOSE);
      };

      const drawCat = () => {
        // Cos del gat
        p.fill(colors.black);
        p.ellipse(p.width / 2, p.height / 2 + 100, 200, 300);

        // Cap del gat
        p.ellipse(p.width / 2, p.height / 2 - 50, 150, 150);

        // Ull gran
        p.fill(colors.beige);
        p.ellipse(p.width / 2 - 30, p.height / 2 - 60, 70, 70);
        p.fill(colors.darkGreen);
        p.ellipse(p.width / 2 - 30, p.height / 2 - 60, 40, 40);
        p.fill(colors.black);
        p.ellipse(p.width / 2 - 30, p.height / 2 - 60, 20, 20);

        // Ull petit
        p.fill(colors.red);
        p.ellipse(p.width / 2 + 40, p.height / 2 - 40, 40, 40);
        p.fill(colors.black);
        p.ellipse(p.width / 2 + 40, p.height / 2 - 40, 20, 20);

        // Boca
        p.noFill();
        p.stroke(colors.beige);
        p.strokeWeight(3);
        p.arc(p.width / 2, p.height / 2 - 10, 80, 50, 0, p.PI);

        // Orelles
        p.stroke(colors.black);
        p.fill(colors.black);
        p.triangle(
          p.width / 2 - 60,
          p.height / 2 - 90,
          p.width / 2 - 20,
          p.height / 2 - 240,
          p.width / 2,
          p.height / 2 - 120
        );
        p.triangle(
          p.width / 2 + 60,
          p.height / 2 - 90,
          p.width / 2 + 20,
          p.height / 2 - 200,
          p.width / 2,
          p.height / 2 - 120
        );

        // Cua
        p.noFill();
        p.stroke(colors.black);
        p.strokeWeight(6);
        p.beginShape();
        p.vertex(p.width / 2 + 100, p.height / 2 + 150);
        p.bezierVertex(
          p.width / 2 + 150,
          p.height / 2 + 100,
          p.width / 2 + 200,
          p.height / 2 + 250,
          p.width / 2 + 100,
          p.height / 2 + 300
        );
        p.endShape();
      };

      const drawSpiral = (x, y, size) => {
        p.stroke(colors.beige);
        p.noFill();
        p.strokeWeight(2);
        p.beginShape();
        for (let i = 0; i < 360 * 4; i += 10) {
          const angle = p.radians(i);
          const r = size + i * 0.1;
          const px = x + r * p.cos(angle);
          const py = y + r * p.sin(angle);
          p.vertex(px, py);
        }
        p.endShape();
      };

      class Particle {
        constructor(x, y) {
          this.x = x;
          this.y = y;
          this.lifespan = 200; // Vida reduïda per a opacitat menor
          this.color = colors.grey;
        }

        update() {
          this.x += p.random(-2, 2);
          this.y += p.random(-2, 2);
          this.lifespan -= 2;
        }

        display() {
          p.noStroke();
          p.fill(this.color, this.lifespan);
          p.ellipse(this.x, this.y, 10);
        }
      }

      p.mousePressed = function () {
        emitParticles = !emitParticles;
      };

      p.keyPressed = function () {
        if (p.key === "c" || p.key === "C") {
          circles.push({
            x: p.mouseX,
            y: p.mouseY,
            size: p.random(20, 40),
            color: p.random([colors.red, colors.darkGreen]),
          });
        } else if (p.key === "s" || p.key === "S") {
          spirals.push({
            x: p.mouseX,
            y: p.mouseY,
            size: p.random(30, 50),
          });
        } else if (p.key === "l" || p.key === "L") {
          lines.push({
            x1: p.mouseX,
            y1: p.mouseY,
            x2: p.mouseX + p.random(-250, 250),
            y2: p.mouseY + p.random(-250, 250),
          });
        }
      };

      p.windowResized = function () {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.background(colors.background);
        drawBackgroundShapes();
        drawCat();
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

export default GenerativeSketch3;
