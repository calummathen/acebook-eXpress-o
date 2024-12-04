import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts, UpdatePost, getFriendsPosts } from "../../services/posts";
import Post from "../../components/Post";
import NewPostForm from "../../components/NewPostForm";

import { useBeanScene } from "../../context/BeanSceneContext";

import NewNavbar from "../../components/NewNavBar";

import AllPostsButton from "../../components/AllPosts";
import FriendsPostsButton from "../../components/FriendsPostsButton";


export function FeedPage() {
  const { theme } = useBeanScene();
  const [posts, setPosts] = useState([]);
  const [updatePost, setUpdatePost] = useState(false);
  const [FriendsPosts, setFriendsPosts] = useState([]);
  const [viewFriendsPosts, setViewFriendsPosts] = useState(false); 
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
        getFriendsPosts(token)
        .then((data) => {
          setFriendsPosts(data.posts);
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

  const toggleFriendsPosts = () => {
    setViewFriendsPosts(true);
    setPosts((prevPosts) => prevPosts.filter((post) => post.isFriend)); };

 
  const toggleAllPosts = () => {
    setViewFriendsPosts(false);
    setUpdatePost(!updatePost);
  };

  return (
    <div
      style={{
        background: theme === "light" ? "white" : "#333333",
        color: theme === "light" ? "#333333" : "white",
      }}
    >
      <NewNavbar />
      <h2>{viewFriendsPosts ? "Friends Posts" : "All Posts"}</h2>
      <FriendsPostsButton toggleFriendsPosts={toggleFriendsPosts}/>
      <div>
        <NewPostForm token={token} setUpdatePost={setUpdatePost} />
      </div>
      <AllPostsButton toggleAllPosts={toggleAllPosts} />
      <div className="feed" role="feed">
        {viewFriendsPosts ? (
          <>
          {FriendsPosts.map((post) => (
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
              hasReposted={post.hasReposted}
            />
          ))}
          </>
        ):(
          <>
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
              hasReposted={post.hasReposted}
            />
          ))}
        </>
        )
      }
      </div>
    </div>
  );
}
