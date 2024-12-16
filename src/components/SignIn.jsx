// SignIn.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/SignIn.css";
import grandma3 from "../assets/grandma3.jpg";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.displayName) {
        const defaultDisplayName = `${email.split("@")[0]}`;
        await updateProfile(user, { displayName: defaultDisplayName });
      }

      setSuccessMessage("Login successful! Redirecting...");
      setError("");

      setTimeout(() => {
        navigate(from); // Redirigeix a la pàgina des d'on venia, per ex. '/checkout'
      }, 2000);
    } catch (error) {
      const firebaseErrorMap = {
        "auth/invalid-email": "The email address is not valid.",
        "auth/user-not-found": "No user found with this email.",
        "auth/wrong-password": "Incorrect password. Please try again.",
      };
      setError(firebaseErrorMap[error.code] || "An unexpected error occurred.");
      setSuccessMessage("");
    } finally {
      setIsLoading(false);
    }
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
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log In"}
          </button>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
