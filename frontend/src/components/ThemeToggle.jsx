import { Switch } from "@headlessui/react";
import { useState } from "react";
import { useBeanScene } from "../context/BeanSceneContext";
import { PiCoffeeFill } from "react-icons/pi";

export const ThemeToggle = () => {
  const [enabled, setEnabled] = useState(false);
  const { theme, setTheme } = useBeanScene();

  const handleToggleChange = () => {
    //   the userChange is the opposite of where the toggle currently is
    const userChange = !enabled;
    // we then set state to milk or no milk!
    setEnabled(userChange);
    // now we update the theme state. if userChange was to true, we update state to add milk!
    // theme state is available globally via const {theme} = useBeanScene()
    // the theme variable will let your component know whether it should be styled with milk or not!
    setTheme(userChange ? "light" : "dark");
  };
  console.log(enabled);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <PiCoffeeFill size={30} style={{ paddingRight: "10px" }} />
      <Switch
        //   our default theme is dark (ie, no milk!) so if the toggle is checked theme = light (ie, add milk!)
        checked={theme === "light"}
        onChange={handleToggleChange}
        style={{
          display: "inline-flex",
          height: "1.5rem",
          width: "3rem",
          alignItems: "center",
          borderRadius: "9999px",
          backgroundColor: enabled ? "#333333" : "#FFFFFF",
          transition: "background-color 0.2s ease-in-out",
        }}
      >
        <span
          style={{
            display: "block",
            width: "1rem",
            height: "1rem",
            borderRadius: "9999px",
            backgroundColor: enabled ? "#FFFFFF" : "#333333",
            transform: enabled ? "translateX(1rem)" : "translateX(0)",
            transition: "transform 0.2s ease-in-out",
          }}
        />
      </Switch>
    </div>
  );
};
