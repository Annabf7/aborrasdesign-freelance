import React from "react";
import { Link } from "react-router-dom";
import generativeVideo from "../assets/generative/generative_2.mp4";
import "../styles/AboutSection.css";

function AboutSection() {
  return (
    <section className="about-section">
      {/* Contingut principal d'About en dues columnes */}
      <div className="content-container">
        {/* Columna esquerra: Text principal */}
        <div className="about-description-wrapper">
          <h1 className="about-title">
            About aborrasdesign<span className="reg-symbol">&reg;</span>
          </h1>
          <p className="about-description">
            To be an independent artist is to be an entrepreneur. It is someone who constantly risks
            everything they have, and they always bring something new with their proposals.
          </p>
          <p className="about-maintext">
            My career as an artist began when I was very young. The tool I used then is the same as
            now: CREATIVITY. The only difference is that we used different materials, such as paper,
            brushes, and paints. I wanted to change the course of my career.
            <br />I had a strong interest in digital art, fascinated by the incredible creations
            that could only be achieved with the software available today. And that’s where my
            journey began, seven years ago.
          </p>

          <blockquote className="quote">
            «Choose a job you love, and you will never have to work a day in your life»
          </blockquote>
          <p className="about-secondarytext">
            As a freelancer, I understand the importance of meeting deadlines and delivering
            high-quality results.{" "}
          </p>
        </div>

        {/* Columna dreta: Serveis, programari i xarxes socials */}
        <div className="services-wrapper">
          <h3>Services</h3>
          <ul className="services-list">
            <li>Creative Direction</li>
            <li>Digital photography</li>
            <li>Web Developer</li>
            <li>UX design</li>
            <li>Motion graphic</li>
            <li>Video: Pro & postproduction</li>
            <li>Branding</li>
          </ul>
          <h3>Software</h3>
          <ul className="software-list">
            <li>Adobe After Effects</li>
            <li>Adobe Photoshop</li>
            <li>Adobe Illustrator</li>
            <li>Adobe Premiere</li>
            <li>Adobe Indesign</li>
            <li>Figma</li>
          </ul>
          <h3>Social Media</h3>
          <ul className="social-list">
            <li>Malt</li>
            <li>Instagram</li>
            <li>Behance</li>
            <li>LinkedIn</li>
            <li>Dribbble</li>
          </ul>
        </div>
      </div>

      {/* Secció de Generative Art amb vídeo de fons */}
      <div className="generative-art-section">
        <video className="generative-art-video" autoPlay loop muted>
          <source src={generativeVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="generative-art-overlay">
          <h2 className="generative-art-title">
            <Link to="/generative-art">GENERATIVE ART</Link>
          </h2>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
