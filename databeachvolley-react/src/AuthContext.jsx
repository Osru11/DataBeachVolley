import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser, login, logout } from "./authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user); // Si no hay usuario, será null
      } catch (error) {
        console.error("Error fetching user in AuthContext:", error);
        setUser(null); // Asegúrate de que el estado esté limpio
      } finally {
        setLoading(false); // Finaliza la carga en cualquier caso
      }
    };
  
    fetchUser();
  }, []);
  
  

  const loginUser = async (email, password) => {
    const data = await login(email, password);
    setUser(data.user); // Actualiza el estado con el usuario autenticado
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
