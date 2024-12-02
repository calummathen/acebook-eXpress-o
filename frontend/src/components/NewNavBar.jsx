import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SearchButton } from "./SearchButton";
import { ThemeToggle } from "./ThemeToggle";
import { useBeanScene } from "../context/BeanSceneContext";



const NewNavbar = () => {
  const { theme } = useBeanScene();
  const navigate = useNavigate();
  const location = useLocation();

    function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <div>
      <div className={theme === "light" ? "nav-bar-light" : "nav-bar-dark"}>
        <div>
          <Link to="/posts" className="nav-title">
            BeanScene
          </Link>
        </div>
        <div className="nav-buttons-wrapper">
          {location.pathname !== "/profile" && (
            <Link className="profile-link" to="/profile">
            Profile
          </Link>
          )}
          <SearchButton />
          <button onClick={() => logout()} type="submit">
            log Out
          </button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

export default NewNavbar;
