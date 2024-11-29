import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Search } from "./Search";

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
            Snob Search <FaChevronUp />{" "}
          </button>
          <Search />
        </div>
      ) : (
        <button
          style={{ width: "110px", marginRight: "10px" }}
          onClick={toggleSlider}
        >
          Snob Search <FaChevronDown />
        </button>
      )}
    </div>
  );
};
