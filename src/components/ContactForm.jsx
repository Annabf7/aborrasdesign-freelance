// src/components/ContactForm.jsx

import React, { useState } from "react";
import logoFooter from "../assets/icons/logo_footer.svg";

// Assignació dinàmica de BASE_URL segons l'entorn
const BASE_URL = process.env.NODE_ENV === 'production'
  ? process.env.REACT_APP_BASE_URL_PROD
  : process.env.REACT_APP_BASE_URL_DEV;

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    const endpoint = `${BASE_URL}/sendContactEmail`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success"); // Estableix un estat específic per al missatge d'èxit
        setFormData({ name: "", email: "", project: "" });
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-wrapper">
        {status === "success" ? (
          <div className="success-message">
            <img src={logoFooter} alt="AborrasDesign Logo" className="success-logo" />
            <h3>Thank you for reaching out!</h3>
            <p>I look forward to providing solutions to your needs and building a path forward together.</p>
            <p>I'll get back to you soon.</p>
          </div>
        ) : (
          <>
            <h2 className="contact-title">Explain to me your project!</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name..."
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email address..."
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="project"
                placeholder="Tell me more about your project..."
                value={formData.project}
                onChange={handleChange}
                required
              />
              <button type="submit">I will contact you right away!</button>
            </form>
            {status && status !== "success" && <p className="form-status">{status}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
