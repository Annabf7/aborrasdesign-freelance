import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase/firebase"; // Afegit db per a Firestore
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore"; // Afegit per guardar al Firestore
import "../styles/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      // Creem l'usuari a Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualitzem el perfil de l'usuari amb el displayName
      const displayName = `${firstName} ${lastName}`;
      await updateProfile(user, { displayName });

      // Guardem la informació addicional al Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
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
      // Map de possibles errors de Firebase
      const firebaseErrorMap = {
        "auth/email-already-in-use": "This email is already in use. Please use a different email.",
        "auth/invalid-email": "Invalid email format. Please enter a valid email address.",
        "auth/weak-password": "Weak password. Please enter a stronger password.",
      };
      setError(firebaseErrorMap[error.code] || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <form className="registerForm" onSubmit={handleRegister}>
        <label className="registerLabel" htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          placeholder="First Name"
          className="registerInput"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

<label className="registerLabel" htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          placeholder="Last Name"
          className="registerInput"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

<label className="registerLabel" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="registerInput"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

<label className="registerLabel" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="registerInput"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

<label className="registerLabel" htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="tel"
          placeholder="Phone Number"
          className="registerInput"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="registerLabel" htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          placeholder="Address"
          className="registerInput"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

<label className="registerLabel" htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          placeholder="City"
          className="registerInput"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

<label className="registerLabel" htmlFor="country">Country</label>
        <input
          id="country"
          type="text"
          placeholder="Country"
          className="registerInput"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

<label className="registerLabel" htmlFor="postalCode">Postal Code</label>
        <input
          id="postalCode"
          type="text"
          placeholder="Postal Code"
          className="registerInput"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <button type="submit" className="registerButton">
          Sign up
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
