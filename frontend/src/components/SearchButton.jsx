import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Search } from "./Search";
import { motion, AnimatePresence } from "motion/react";
export const SearchButton = () => {
  const [slider, setSlider] = useState(false);

  const toggleSlider = () => {
    if (!slider) {
      setSlider(true);
    } else {
      setSlider(false);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "right",
      }}
    >
      {slider ? (
        <div>
          <button
            style={{
              width: "110px",
              marginRight: "10px",
            }}
            onClick={toggleSlider}
          >
            Snob Search <FaChevronRight />{" "}
          </button>
          <AnimatePresence>
            <motion.div
              exit={{ x: 1000 }}
              initial={{ x: 1000 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
                height: "50vh",
                width: "40vw",
                position: "absolute",
                top: 70,
                right: 0,
                flexDirection: "column",
                padding: "20px",
                boxSizing: "border-box",
                background: "black",
                opacity: "90%",
                borderBottomLeftRadius: "5%",
              }}
            >
              <Search />
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <button
          style={{ width: "110px", marginRight: "10px" }}
          onClick={toggleSlider}
        >
          Snob Search <FaChevronLeft />
        </button>
      )}
    </div>
  );
};
