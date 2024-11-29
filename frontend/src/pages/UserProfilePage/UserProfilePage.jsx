import { useLoaderData } from "react-router-dom"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPosts } from "../../services/posts";
import Post from "../../components/Post";
import NewNavbar from "../../components/NewNavBar";

export async function loader({ params }) {
    const username = params.username
    return { username }
}

export function UserProfilePage() {
    const { username } = useLoaderData()

    const [posts, setPosts] = useState([]);
    const [updatePost, setUpdatePost] = useState(false);
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      const loggedIn = token !== null;
      if (loggedIn) {
        getUserPosts(token, username)
          .then((data) => {
            setPosts(data.posts);
            localStorage.setItem("token", data.token);
          })
          .catch((err) => {
            console.error(err);
            navigate("/login");
          });
      }
    }, [navigate, updatePost]);
  
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return ;
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
            isLiked={post.hasLiked}
            beans={post.beans}
            updatePost={setUpdatePost}
            isYours={false}
          />
        ))}
      </div>
      </div>
    );
}