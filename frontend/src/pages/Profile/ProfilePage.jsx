import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getYourPosts } from "../../services/posts";
import Post from "../../components/Post";
import NewNavbar from "../../components/NewNavBar";

export function ProfilePage() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      const loggedIn = token !== null;
      if (loggedIn) {
        getYourPosts(token)
          .then((data) => {
            setPosts(data.posts);
            localStorage.setItem("token", data.token);
          })
          .catch((err) => {
            console.error(err);
            navigate("/login");
          });
      }
    }, [navigate]);
  
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    
    
    return (
      <div className="profile">
        <h1>Welcome to your COFFEE COUNTER!</h1>
        <div className="feed" role="feed">
          <NewNavbar/>
        {posts.map((post) => (
          <Post
            post={post}
            key={post._id}
            user={post.user}
            message={post.message}
            timestamp={post.timestamp}
          />
        ))}
      </div>
      </div>
    );
  }
  