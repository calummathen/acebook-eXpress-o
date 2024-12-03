import { createContext, useContext, useState } from "react";

export const AppContext = createContext(null);

export function BeanSceneContextProvider({ children }) {
  const [enabled, setEnabled] = useState();
  const [theme, setTheme] = useState("dark");
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
