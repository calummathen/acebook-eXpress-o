import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPosts, UpdatePost, getFriendsPosts } from "../../services/posts";
import Post from "../../components/Post";
import NewPostForm from "../../components/NewPostForm";

import { useBeanScene } from "../../context/BeanSceneContext";

import NavBar from "../../components/NavBar";

import AllPostsButton from "../../components/AllPosts";
import FriendsPostsButton from "../../components/FriendsPostsButton";

import "./FeedPage.css";

export function FeedPage() {
  const { theme } = useBeanScene();
  
  const token = localStorage.getItem("token");
  
  const [posts, setPosts] = useState([]);
  const [updatePost, setUpdatePost] = useState(false);
  const [FriendsPosts, setFriendsPosts] = useState([]);
  const [viewFriendsPosts, setViewFriendsPosts] = useState(false); 
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (token) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/");
        });
      
      getFriendsPosts(token)
        .then((data) => {
          setFriendsPosts(data.posts);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/");
        });
    } else {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, updatePost]);
  
  const toggleFriendsPosts = () => {
    setViewFriendsPosts(true);
    setPosts((prevPosts) => prevPosts.filter((post) => post.isFriend));
  };  
    
  const toggleAllPosts = () => {
    setViewFriendsPosts(false);
    setUpdatePost(!updatePost);
  };
    
  return (
      <div className={`wrapper-feedpage ${theme === "light" ? "wrapper-feedpage-light" : "wrapper-feedpage-dark"}`}>
      
        <NavBar />

        <div className="sidebar-newpost">
          <NewPostForm token={token} setUpdatePost={setUpdatePost} />
          <div className="sidebar-newpost-video">
            <iframe
              width="650"
              height="366"
              src="https://www.youtube.com/embed/0jIeCAOkgcQ?autoplay=1&controls=0&modestbranding=1&showinfo=0&rel=0&loop=1&playlist=0jIeCAOkgcQ&mute=1"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <div className="posts-feedpage">
          <div className="posts-toggle">
            <AllPostsButton toggleAllPosts={toggleAllPosts} viewFriendsPosts={viewFriendsPosts} />
            <FriendsPostsButton toggleFriendsPosts={toggleFriendsPosts} viewFriendsPosts={viewFriendsPosts} />
          </div>

          <h2>{viewFriendsPosts ? "Friends Posts" : "All Posts"}</h2>
          <div className="posts-feed">
            {viewFriendsPosts ? (
              <>
              {FriendsPosts.map((post) => (
                <Post
                  key={post._id}
                  post={post}
                  setUpdatePost={setUpdatePost}
                />
              ))}
              </>
            ):(
              <>
              {posts.map((post) => (
                <Post
                key={post._id}
                post={post}
                setUpdatePost={setUpdatePost}
                />
              ))}
              </>
            )
          }
        </div>
      </div>
    </div>
  );
}
