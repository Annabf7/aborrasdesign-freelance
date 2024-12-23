// src/components/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles/UserProfile.css";
import grandma4 from "../assets/grandma4.jpg";


function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [preferredPayment, setPreferredPayment] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    // Funció per obtenir les dades de l'usuari des de Firestore
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          // Obtenim la referència del document de l'usuari
          const userDocRef = doc(db, "users", user.uid);
          
          // Fem la consulta al document
          const userDoc = await getDoc(userDocRef);
    
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setPreferredLanguage(data.preferredLanguage || "");
            setPreferredPayment(data.preferredPayment || "");
            setAddress(data.address || "");
            setCity(data.city || "");
            setCountry(data.country || "");
            setPostalCode(data.postalCode || "");
          } else {
            // Si el document no existeix, el creem amb valors per defecte
            const displayNameParts = user.displayName ? user.displayName.split(" ") : [];
            const firstName = displayNameParts[0] || "";
            const lastName = displayNameParts.slice(1).join(" ") || "";
    
            await updateDoc(userDocRef, {
              firstName,
              lastName,
              email: user.email || "",
              phone: user.phoneNumber || "",
              address: "",
              city: "",
              country: "",
              postalCode: "",
              preferredLanguage: "",
              preferredPayment: ""
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);

  const handlePreferenceChange = async (field, value) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { [field]: value });
        setUpdateStatus("Preferences updated successfully.");
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      setUpdateStatus("Error updating preferences. Please try again.");
    }
  };

  const handleAddressUpdate = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          address,
          city,
          country,
          postalCode
        });
        setUpdateStatus("Address updated successfully.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setUpdateStatus("Error updating address. Please try again.");
    }
  };

  // Genera la URL de l'avatar de l'usuari amb colors personalitzats
  const getAvatarUrl = (firstName, lastName) => {
    const name = `${firstName} ${lastName.split(' ')[0]}`; // Agafem només el primer cognom
    const encodedName = encodeURIComponent(name.trim() || "User");
    return `https://ui-avatars.com/api/?name=${encodedName}&background=d7b46a&color=1e1f1f&size=128`;
  };
  

  return (
    <div className="user-profile-page">
      <div className="profile-image-section">
        <img src={grandma4} alt="User Profile" className="profile-image" />
      </div>
      <div className="profile-info-section">
        <h2 className="section-title">USER PROFILE</h2>


        <div className="profile-details">
          <div className="info-section">
            <h3>Personal Information</h3>
            <div className="info-item">
              <img
               src={
                userData
                  ? getAvatarUrl(userData.firstName, userData.lastName)
                  : getAvatarUrl("User", "")
              }
                alt="User Avatar"
                className="user-icon" // Manté el nom de la classe per l'estilització
              />
           <div className="info-text">
              <p>{userData ? `${userData.firstName} ${userData.lastName}` : "User Name"}</p>
              <p>{userData ? userData.email : "Email"}</p>
              <p>{userData ? userData.phone : "Phone Number"}</p>
            </div>

            </div>
          </div>

          <div className="address-section">
            <h3>Shipping Address</h3>
            <div className="address-form">
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <label htmlFor="country">Country:</label>
              <input
                type="text"
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />

              <label htmlFor="postalCode">Postal Code:</label>
              <input
                type="text"
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />

              <button className="edit-button" onClick={handleAddressUpdate}>
                Update Address
              </button>
            </div>
          </div>

          <div className="preferences-section">
            <h3>User Preferences</h3>

            {/* Preferències d'idioma */}
            <label htmlFor="language-select">Preferred Language</label>
            <select
              id="language-select"
              value={preferredLanguage}
              onChange={(e) => {
                setPreferredLanguage(e.target.value);
                handlePreferenceChange("preferredLanguage", e.target.value);
              }}
            >
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Catalan">Catalan</option>
              <option value="Spanish">Spanish</option>
            </select>

            {/* Preferències de mètode de pagament */}
            <label htmlFor="payment-select">Preferred Payment Method</label>
            <select
              id="payment-select"
              value={preferredPayment}
              onChange={(e) => {
                setPreferredPayment(e.target.value);
                handlePreferenceChange("preferredPayment", e.target.value);
              }}
            >
              <option value="">Select Payment Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Amazon Pay">Amazon Pay</option>
            </select>

            {/* Missatge de confirmació */}
            {updateStatus && <p className="update-status">{updateStatus}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
