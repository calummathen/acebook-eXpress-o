import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SearchButton } from "./SearchButton";

const NewNavbar = () => {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <div>
      <div className="nav-bar">
        <div>
          <Link to="/posts" className="nav-title">
            BeanScene
          </Link>
        </div>
        <div className="nav-buttons-wrapper">
          <Link className="profile-link" to="/profile">
            Profile
          </Link>
          <SearchButton />
          <button onClick={() => logout()} type="submit">
            log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewNavbar;
