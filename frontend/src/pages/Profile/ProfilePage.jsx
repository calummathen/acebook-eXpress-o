import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getYourPosts } from "../../services/posts";
import Post from "../../components/Post";
import NewNavbar from "../../components/NewNavBar";
import "./ProfilePage.css";
import { getFriendsForUser } from "../../services/friends";

export function ProfilePage() {
    const [posts, setPosts] = useState([]);
    const [updatePost, setUpdatePost] = useState(false);
    const [friends, setFriends] = useState([]);
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
    }, [navigate, updatePost]);

    useEffect(() => {
      const fetchFriends = async () => {
        const token = localStorage.getItem("token");
  
        if (!token) {
          navigate("/login");
          return;
        }
  
        try {
          const fetchedFriends = await getFriendsForUser(token);
          setFriends(fetchedFriends.friends); 
        } catch (error) {
          console.error("Error fetching friends:", error.message);
        }
      };
  
      fetchFriends();
    }, [navigate, updatePost]); 

    const users = friends.map(friend => friend.sender == friend.user ? friend.receiver : friend.sender);
    // console.log(users)
    const timestamps = friends.map(friend => friend.timestamp);
    // console.log(timestamps)

    return (
      <div className="profile">
        <div className="feed" role="feed">
          <NewNavbar/>
        <div>
      {/* <div>
        {users}
      </div> */}
      </div>
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
            isYours={true}
          />
        ))}
      </div>
    </div>
  );
}
