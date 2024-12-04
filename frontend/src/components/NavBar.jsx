import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { MdOutlineCoffee } from "react-icons/md";

import { SearchButton } from "./SearchButton";
import { ThemeToggle } from "./ThemeToggle";
import { useBeanScene } from "../context/BeanSceneContext";

import "./NavBar.css";

const NavBar = () => {

    const { theme } = useBeanScene();

    const navigate = useNavigate();
    const location = useLocation();
    
    function logout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <div className={`nav-bar ${theme === "light" ? "nav-bar-light" : "nav-bar-dark"}`}>
            <div className="nav-logo-wrapper">
                <Link to="/posts" className="nav-title">
                    <MdOutlineCoffee />
                    BeanScene
                </Link>
            </div>

            <div className="nav-buttons-wrapper">
                {location.pathname !== "/profile" && (
                    <Link id="profile-button" to="/profile">Profile</Link>
                )}
    
                <SearchButton />
    
                <button id="logout-button" onClick={() => logout()} type="submit">Log Out</button>

                <ThemeToggle />

            </div>
        </div>
    );
};

export default NavBar;
