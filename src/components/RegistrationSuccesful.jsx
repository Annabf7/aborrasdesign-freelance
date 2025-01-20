import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegistrationSuccesful.css";
import grandma1 from "../assets/grandma1.jpg";

const RegistrationSuccesful = () => {
  const navigate = useNavigate();

  return (
    <div className="registration-successful-container">
      <div className="image-section">
        <img src={grandma1} alt="Stylish grandma with pink hair" className="registration-image" />
      </div>
      <div className="message-section">
        <h1 className="brand-title">
          ABORRASDESIGN<span className="reg-symbol">&reg;</span>
        </h1>

        <h2>Registration successful!</h2>
        <p>You can now log in with your new account</p>
        <button className="login-button" onClick={() => navigate("/login")}>
          Go to Log In
        </button>

      </div>
    </div>
  );
};

export default RegistrationSuccesful;
