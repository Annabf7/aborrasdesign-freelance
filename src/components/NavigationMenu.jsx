import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import logIn from "../assets/icons/log in.svg";
import logo from "../assets/logo.png";
import shoppingCart from "../assets/icons/shopping-cart.png";

function NavigationMenu() {
  const { user, logOut } = useAuth(); // Utilitza useAuth per obtenir user i logOut
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    console.log("User authentication status:", user); // Verifica l'estat de l'usuari
  }, [user]);

  const handleLogOut = () => {
    logOut();
    setIsDropdownOpen(false); // Tanca el menú desplegable en tancar la sessió
    navigate("/"); // Redirigeix a la pàgina principal després de tancar sessió
  };

  const handleAuthClick = () => {
    if (!user) {
      navigate("/auth"); // Si no hi ha usuari, redirigeix a la pàgina d'autenticació
    }
  };

  return (
    <div className="menu-container">
      <Link to="/">
        <img className="logo" src={logo} alt="Logo" />
      </Link>
      <nav className="menu-items">
        <Link className="menu-item" to="/">
          Home
        </Link>

        <div className="dropdown">
          <span className="menu-item">Services</span>
          <div className="dropdown-content">
            <Link to="/photography">Photography</Link>
            <Link to="/webfrontend">WebFrontend</Link>
            <Link to="/motiongraphic">Motion Graphic</Link>
          </div>
        </div>

        <Link className="menu-item" to="/about">
          About
        </Link>

        {/* Mostra la icona de registre o el menú desplegable segons l'estat de l'usuari */}
        <div
          className="user-menu"
          onMouseEnter={() => user && setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
          onClick={handleAuthClick} // Redirigeix a la pàgina d'autenticació si no hi ha usuari
        >
          <img className="logIn" src={logIn} alt="User Profile" />
          {user && isDropdownOpen && (
            <div className="user-dropdown">
              <span className="dropdown-item" onClick={() => navigate("/profile")}>
                Profile
              </span>
              <span className="dropdown-item" onClick={() => navigate("/order-history")}>
                Order History
              </span>
              <span className="dropdown-item" onClick={handleLogOut}>
                Log Out
              </span>
            </div>
          )}
        </div>

        <Link to="/cart">
          <img className="shopping-cart" src={shoppingCart} alt="Shopping Cart" />
        </Link>
      </nav>
    </div>
  );
}

export default NavigationMenu;
