import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts, UpdatePost } from "../../services/posts";
import Post from "../../components/Post";
import NewPostForm from "../../components/NewPostForm";

import { useBeanScene } from "../../context/BeanSceneContext";

import NewNavbar from "../../components/NewNavBar";

export function FeedPage() {
  const { theme } = useBeanScene();
  const [posts, setPosts] = useState([]);
  const [updatePost, setUpdatePost] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getPosts(token)
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
    return;
  }

  return (
    <div
      style={{
        background: theme === "light" ? "white" : "#333333",
        color: theme === "light" ? "#333333" : "white",
      }}
    >
      <NewNavbar />
      <h2>Posts</h2>
      <div>
        <NewPostForm token={token} setUpdatePost={setUpdatePost} />
      </div>
      <div className="feed" role="feed">
        {posts.map((post) => (
          <Post
            post={post}
            key={post._id}
            user={post.user}
            message={post.message}
            timestamp={post.timestamp}
            isLiked={post.hasLiked}
            beans={post.beans}
            updatePost={UpdatePost}
            setUpdatePost={setUpdatePost}
            isYours={post.isYours}
          />
        ))}
      </div>
    </div>
  );
}
