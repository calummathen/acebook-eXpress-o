import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getYourPosts } from "../../services/posts";
import Post from "../../components/Post";
import NewNavbar from "../../components/NewNavBar";
import "./ProfilePage.css";
import { getFriendsForUser, getUnapprovedFriendsForUser } from "../../services/friends";
import MyCoffeeMates from "../../components/MyCoffeeMates";

export function ProfilePage() {
  const [posts, setPosts] = useState([]);
  const [updatePost, setUpdatePost] = useState(false);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const [coffeeMateQuery, setCoffeeMateQuery] = useState("");
  const [filteredConfirmedFriends, setFilteredConfirmedFriends] = useState([]);

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
          const fetchedRequests = await getUnapprovedFriendsForUser(token)
          setFriends(fetchedFriends.friends); 
          setRequests(fetchedRequests.friends)
        } catch (error) {
          console.error("Error fetching friends:", error.message);
        }
      };
  
      fetchFriends();


    }, [navigate, updatePost]); 

    // console.log(requests)
    // const user = friends[0].user
    // console.log(user)
    // const users = friends.map(friend => friend.sender == friend.user ? friend.receiver : friend.sender);
    // console.log(users)
    // const timestamps = friends.map(friend => friend.timestamp);
    // console.log(timestamps)

  const getConfirmedFriends = () => {
    return friends.map((friend) =>
      friend.sender == friend.user ? friend.receiver : friend.sender
    );
  };

  const createFilteredConfirmedFriends = (query, allFriends) => {
    if (query.trim() === "") {
      return allFriends;
    }
    return allFriends.filter((el) => {
      return el.toLowerCase().includes(query.toLowerCase());
    });
  };

  useEffect(() => {
    const confirmedFriends = getConfirmedFriends(friends);
    const result = createFilteredConfirmedFriends(
      coffeeMateQuery,
      confirmedFriends
    );
    setFilteredConfirmedFriends(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coffeeMateQuery, friends]);

  // const timestamps = friends.map((friend) => friend.timestamp);

  return (
    <div className="profile">
      <NewNavbar />
      <div
        style={{
          display: "flex",
          gap: "30px",
          flexDirection: "row",
          height: "100vh",
        }}
        role="feed"
      >
        <div style={{ width: "30%" }}>
          {/* we need to make this better!! */}
          {(posts.length > 0) && (<h1>{posts[0].user}</h1>)}
          <MyCoffeeMates
            filteredConfirmedFriends={filteredConfirmedFriends}
            coffeeMateQuery={coffeeMateQuery}
            setCoffeeMateQuery={setCoffeeMateQuery}
          />
        </div>
        <div style={{ width: "70%" }}>
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
    </div>
  );
}
