// AuthPage.jsx
import React, { useState } from "react";
import Register from "./Register";
import { useNavigate, useLocation } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "../styles/AuthPage.css";
import grandma from "../assets/grandma.jpg";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [isRegister, setIsRegister] = useState(true);

  const handleLoginClick = () => {
    // Redirigeix a /login amb el state from
    navigate("/login", { state: { from } });
  };

  const handleGoogleLogin = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        navigate(from); // Redirigeix a la pàgina d'on venia (checkout, per exemple)
      })
      .catch((error) => {
        console.error("Error en iniciar sessió:", error);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-image-section">
        <img src={grandma} alt="Stylish grandma" className="auth-image" />
      </div>
      <div className="auth-form-section">
        <h1 className="brand-title">
          ABORRASDESIGN<span className="reg-symbol">&reg;</span>
        </h1>

        {isRegister ? (
          <>
            <Register />
            <p>
              Already have an account?{" "}
              <span onClick={handleLoginClick} className="auth-toggle">
                Log in
              </span>
            </p>
          </>
        ) : (
          <>
            <Register />
            <p>
              Don’t have an account?{" "}
              <span onClick={() => setIsRegister(true)} className="auth-toggle">
                Sign up
              </span>
            </p>
          </>
        )}
        <button onClick={handleGoogleLogin}>Inicia sessió amb Google</button>
      </div>
    </div>
  );
}

export default AuthPage;
