import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext(null);

export function BeanSceneContextProvider({ children }) {
  const toggleStateFromLocalStorage = localStorage.getItem("enabled");
  const [enabled, setEnabled] = useState(
    toggleStateFromLocalStorage
      ? JSON.parse(toggleStateFromLocalStorage)
      : false
  );
  const [theme, setTheme] = useState(enabled ? "light" : "dark");

  useEffect(() => {
    localStorage.setItem("enabled", JSON.stringify(enabled));
    setTheme(enabled ? "light" : "dark");
  }, [enabled]);
  return (
    <AppContext.Provider value={{ theme, setTheme, enabled, setEnabled }}>
      {children}
    </AppContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBeanScene() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useBeanScene must be within a contextProvider");
  }
  return context;
}
