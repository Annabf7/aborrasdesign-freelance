import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom"; 
import "../styles/SignIn.css";
import grandma3 from "../assets/grandma3.jpg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Obté l'estat de la navegació anterior

  // Defineix el retorn per defecte a "/" si no hi ha una pàgina de retorn especificada
  const from = location.state?.from || "/";

  const handleSignIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed in:", userCredential.user);
        setSuccessMessage("Login successful! Redirecting...");
        setError("");
        setTimeout(() => {
          navigate(from); // Redirigeix a la pàgina de retorn o a la pàgina principal
        }, 2000);
      })
      .catch((error) => {
        setError(error.message);
        setSuccessMessage("");
      });
  };

  return (
    <div className="signin-container">
      <div className="image-section">
        <img src={grandma3} alt="Stylish grandma with leopard print" className="signin-image" />
      </div>
      <div className="message-section">
        <h1 className="brand-title">
          ABORRASDESIGN<span className="reg-symbol">&reg;</span>
        </h1>
        <h2>Welcome back!</h2>
        <p>Please enter your details to continue</p>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Log In</button>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
