import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import logIn from "../assets/icons/log in.svg";
import logo from "../assets/logo.png";
import shoppingCart from "../assets/icons/shopping-cart.png";

function NavigationMenu() {
  const { user, logOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);


  useEffect(() => {
    function handleClickOutside(e) {
      if (
        servicesOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setServicesOpen(false);
      }
      if (
        isDropdownOpen &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [servicesOpen, isDropdownOpen]);

  const handleLogOut = () => {
    logOut();
    setIsDropdownOpen(false);
    navigate("/");
  };

  const handleAuthClick = () => {
    if (!isLoggedIn) {
      navigate("/auth"); // Redirigeix al login si no està loguejat
    } else {
      setIsDropdownOpen(!isDropdownOpen); // Alterna el menú desplegable
    }
  };

  const handleServicesClick = () => {
    setServicesOpen(!servicesOpen);
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

        <div className="dropdown" ref={dropdownRef}>
          <span className="menu-item" onClick={handleServicesClick}>
            Services
          </span>
          {servicesOpen && (
            <div className="dropdown-content">
              <Link to="/photography">Photography</Link>
              <Link to="/webfrontend">WebFrontend</Link>
              <Link to="/motiongraphic">Motion Graphic</Link>
              <Link to="/automationdesign">Automation Design</Link>
            </div>
          )}
        </div>

        <Link className="menu-item" to="/about">
          About
        </Link>

        <div className="user-menu" onClick={handleAuthClick} ref={userDropdownRef}>
          <img className="logIn" src={logIn} alt="User Profile" />
          {isLoggedIn && isDropdownOpen && ( // Només es mostra si està loguejat
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
