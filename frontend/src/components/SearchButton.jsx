import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MdOutlineSearch, MdOutlineSearchOff } from "react-icons/md";

import { Search } from "./Search";
import { useBeanScene } from "../context/BeanSceneContext";

export const SearchButton = () => {

    const { theme } = useBeanScene();
    const [slider, setSlider] = useState(false);
    
    document.body.style.overflow = "auto"

    const toggleSlider = () => {
        document.body.style.overflow = slider ? "auto" : "hidden";
        setSlider(slider => !slider);
    }

    return (
        <>
            <button id="search-button" onClick={toggleSlider}>{ slider ? <MdOutlineSearchOff /> : <MdOutlineSearch /> } { slider ? "Snob Search" : "Snob Search" }</button>
            { slider && (
                <div id="search-wrapper" className={theme === "light" ? "search-wrapper-light" : "search-wrapper-dark"}>
                    <AnimatePresence>
                        <div onClick={toggleSlider} />
                        <motion.div
                            exit={{ x: 1000 }}
                            initial={{ x: 1000 }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="search-box">
                            <Search />
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </>
    );
};
