import React, { createContext, useContext, useEffect } from 'react';

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
  useEffect(() => {
    const headerMenu = document.getElementById("hm-header");

    const handleScroll = () => {
      if (window.scrollY > 20) {
        headerMenu.className = "header-fixed";
      } else {
        headerMenu.className = "header";
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <ScrollContext.Provider value={{}}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);