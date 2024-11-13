import React from "react";
import logoFooterBlack from "../assets/icons/logo_footer_gold.svg"; // Logo daurat per a fons fosc
import logoFooterWhite from "../assets/icons/logo_footer.svg"; // Logo negre per a fons clar
import instagramIcon from "../assets/icons/instagram.png";
import behanceIcon from "../assets/icons/behance.png";
import linkedinIcon from "../assets/icons/linkedin.png";
import vimeoIcon from "../assets/icons/vimeo.png";
import dribbbleIcon from "../assets/icons/dribbble.png";

// Footer en fons negre
export const FooterBlack = () => {
  return (
    <footer className="footer footer-black">
      <FooterContent isBlack />
    </footer>
  );
};

// Footer en fons blanc
export const FooterWhite = () => {
  return (
    <footer className="footer footer-white">
      <FooterContent isBlack={false} />
    </footer>
  );
};

// Contingut comú del footer
const FooterContent = ({ isBlack }) => {
  return (
    <div className="footerWidth">
      <div className="footer-left">
        <h3>aborrasdesign.com</h3>
        <div className="social-icons">
          <a href="https://www.behance.net/" target="_blank" rel="noopener noreferrer">
            <img className="social-icon" src={behanceIcon} alt="Behance" />
          </a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            <img className="social-icon" src={instagramIcon} alt="Instagram" />
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
            <img className="social-icon" src={linkedinIcon} alt="LinkedIn" />
          </a>
          <a href="https://www.vimeo.com/" target="_blank" rel="noopener noreferrer">
            <img className="social-icon" src={vimeoIcon} alt="Vimeo" />
          </a>
          <a href="https://www.dribbble.com/" target="_blank" rel="noopener noreferrer">
            <img className="social-icon" src={dribbbleIcon} alt="Dribbble" />
          </a>
        </div>
      </div>

      <div className="footer-center">
        <img
          className="footer-logo"
          src={isBlack ? logoFooterBlack : logoFooterWhite}
          alt="Footer Logo"
        />
      </div>

      <div className="footer-right">
        <p className="contact-text">
          If you liked my work, <br /> introduce me to your project! <br />
          <a className="contact-email" href="mailto:aborrasdesign@gmail.com">
            aborrasdesign@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};
