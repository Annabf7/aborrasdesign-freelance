import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "../styles/UserProfile.css";
import grandma4 from "../assets/grandma4.jpg";
import userIcon from "../assets/icons/user.png";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [preferredLanguage, setPreferredLanguage] = useState("");
  const [preferredPayment, setPreferredPayment] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    // Funció per obtenir les dades de l'usuari des de Firestore
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setPreferredLanguage(data.preferredLanguage || "");
            setPreferredPayment(data.preferredPayment || "");
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
              <img src={userIcon} alt="User Icon" className="user-icon" />
              <div className="info-text">
                <p>{userData ? userData.name : "User Name"}</p>
                <p>{userData ? userData.email : "Email"}</p>
                <p>{userData ? userData.phone : "Phone Number"}</p>
              </div>
            </div>
          </div>

          <div className="address-section">
            <h3>Shipping Address</h3>
            <p>{userData ? userData.address : "Address"}</p>
            <p>{userData ? userData.city : "City"}</p>
            <p>{userData ? userData.country : "Country"}</p>
            <p>{userData ? userData.postalCode : "Postal Code"}</p>
            <button className="edit-button">Edit Address</button>
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

          <div className="activity-section">
            <h3>Activity History</h3>
            <p>Order #1234</p>
            <p>Date: October 15, 2024</p>
            <p>Item: "Noise Field" - Generative Art</p>
            <p>Status: Completed</p>
            <button className="details-button">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
