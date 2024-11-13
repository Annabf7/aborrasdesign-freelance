import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/firebase"; // Afegit db per a Firestore
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; // Afegit per guardar al Firestore
import "../styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Després de crear l'usuari, guardem la informació addicional al Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        phone,
        address,
        city,
        country,
        postalCode,
        email: user.email,
      });

      setError("");
      navigate("/registration-successful");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please use a different email.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email format. Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Weak password. Please enter a stronger password.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      
      <form className="registerForm" onSubmit={handleRegister}>
        <label className="registerLabel">Name</label>
        <input
          type="text"
          placeholder="Name"
          className="registerInput"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <label className="registerLabel">Email</label>
        <input
          type="email"
          placeholder="Email"
          className="registerInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        
        <label className="registerLabel">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="registerInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <label className="registerLabel">Phone Number</label>
        <input
          type="tel"
          placeholder="Phone Number"
          className="registerInput"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        
        <label className="registerLabel">Address</label>
        <input
          type="text"
          placeholder="Address"
          className="registerInput"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        
        <label className="registerLabel">City</label>
        <input
          type="text"
          placeholder="City"
          className="registerInput"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        
        <label className="registerLabel">Country</label>
        <input
          type="text"
          placeholder="Country"
          className="registerInput"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
        
        <label className="registerLabel">Postal Code</label>
        <input
          type="text"
          placeholder="Postal Code"
          className="registerInput"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />
        
        <button type="submit" className="registerButton">Sign up</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
