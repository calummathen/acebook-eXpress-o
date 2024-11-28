import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const NewNavbar = () => {
const navigate = useNavigate();
function logout (){
    localStorage.removeItem("token");
    navigate("/")
}
  return (
    <div >
        
        <div className="nav-link">
            <p className="nav-title">BeanScene
            <Link className="nav-link" to="/posts">Feed</Link>
            <Link className="nav-link" to="/profile">Profile</Link>
            <button onClick={() => logout()}
            type="submit">log Out
            </button>
            
            </p>
        </div>
          
    </div>
  )
}

export default NewNavbar;


