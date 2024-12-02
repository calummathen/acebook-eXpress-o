import { useLoaderData } from "react-router-dom"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPosts } from "../../services/posts";
import Post from "../../components/Post";
import NewNavbar from "../../components/NewNavBar";
import { getFriendsForAnotherUser } from "../../services/friends";
import AddFriendButton from "../../components/AddFriendButton";
import { sendFriendRequest } from "../../services/friends";

export async function loader({ params }) {
    const username = params.username
    return { username }
}

export function UserProfilePage() {
    const token = localStorage.getItem("token");
    const { username } = useLoaderData()
    const [name, setName] = useState();
    const [posts, setPosts] = useState([]);
    const [updatePost, setUpdatePost] = useState(false);
    const [friends, setFriends] = useState([]);
    const [requests, setReque];
    const [friendRequestStatus, setFriendRequestStats] = useState(0);
    const navigate = useNavigate();
  
    useEffect(() => {
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

    useEffect(() => {
      const fetchFriends = async () => {
  
        if (!token) {
          navigate("/login");
          return;
        }
  
        try {
          const fetchedFriends = await getFriendsForAnotherUser(token, username);
          setFriends(fetchedFriends.friends);
          console.log(fetchedFriends.friends)

        } catch (error) {
          console.error("Error fetching friends:", error.message);
        }
      };
  
      fetchFriends();
    }, [navigate, updatePost]); 

    const friendsUsernames = friends.map(friend => friend.sender == username ? friend.receiver : friend.sender);
    // console.log(friendsUsernames)
    const timestamps = friends.map(friend => friend.timestamp);
    // console.log(timestamps)
  
    if (!token) {
      navigate("/login");
      return ;
    }

    async function addFriend() {
      await sendFriendRequest(token, username);
    }

    return (
      <div className="profile">
        <h1>Welcome to your COFFEE COUNTER!</h1>
        <div className="feed" role="feed">
          <NewNavbar/>
          <AddFriendButton sendFriendRequest={addFriend}/>
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