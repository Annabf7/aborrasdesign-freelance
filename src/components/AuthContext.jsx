// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estat per controlar si l'usuari ha fet login // Nou estat

  useEffect(() => {
    //console.log("[AuthContext] Initializing onAuthStateChanged listener");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      //console.log("[AuthContext] onAuthStateChanged fired:", currentUser);
      setUser(currentUser);
      setIsLoggedIn(!!currentUser); // Actualitza l'estat de isLoggedIn basant-se en si hi ha un usuari actiu // Nou
      setLoading(false);
    });

    return () => {
     // console.log("[AuthContext] Cleaning up onAuthStateChanged listener");
      unsubscribe();
    };
  }, []);

  const logOut = async () => {
    //console.log("[AuthContext] logOut called");
    try {
      await signOut(auth);
      setIsLoggedIn(false); // Reinicia l'estat de isLoggedIn quan es fa logout // Nou
      //console.log("[AuthContext] signOut completed. auth.currentUser:", auth.currentUser);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logOut, loading, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
