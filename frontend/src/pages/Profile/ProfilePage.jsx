import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getYourPosts } from "../../services/posts";
import Post from "../../components/Post";
import NewNavbar from "../../components/NewNavBar";
import "./ProfilePage.css";
import {
  getFriendsForUser,
  getUnapprovedFriendsForUser,
} from "../../services/friends";
import MyCoffeeMates from "../../components/MyCoffeeMates";
import { getUserInfo, getUserByUsername } from "../../services/users";

export function ProfilePage() {
  const token = localStorage.getItem("token");
  const [name, setName] = useState();
  const [posts, setPosts] = useState([]);
  const [updatePost, setUpdatePost] = useState(false);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const navigate = useNavigate();

  const [coffeeMateQuery, setCoffeeMateQuery] = useState("");
  const [filteredConfirmedFriends, setFilteredConfirmedFriends] = useState([]);

  useEffect(() => {
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

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const fetchedFriends = await getFriendsForUser(token);
        const fetchedRequests = await getUnapprovedFriendsForUser(token);
        setFriends(fetchedFriends.friends);
        setRequests(fetchedRequests.friends);
      } catch (error) {
        console.error("Error fetching friends:", error.message);
      }
    };

    fetchFriends();
  }, [navigate, updatePost]);

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
  
  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        const data = await getUserInfo(token);
        setName(data.UserInfo.name);
      };
      fetchUserData();
    }
  }, [token]);

  useEffect(() => {
    const getUpcomingBirthdays = async () => {
      const today = new Date();
      let upcoming = [];

      for (const friend of friends) {

        try { 
          const friendUsername = friend.sender === friend.user ? friend.receiver : friend.sender;
  

          const user = await getUserByUsername(friendUsername, token);

          if (user && user.birthday) {
            const birthday = new Date(user.birthday);
         
          const thisYearBirthday = new Date (today.getFullYear(), birthday.getMonth(), birthday.getDate());
        
          const thirtyDaysFromToday = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  
          // Check if the birthday is within the next 30 days
          // Ensure that if the birthday date is in the past (before today), we add one year to it
          if (thisYearBirthday >= today && thisYearBirthday <= thirtyDaysFromToday) {
            upcoming.push({
              username: user.username,
              birthday: thisYearBirthday
            });
          } else {
            // Optionally, if the birthday is in the past but within 30 days next year, you can adjust the year
            const nextYearBirthday = new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
            if (nextYearBirthday >= today && nextYearBirthday <= thirtyDaysFromToday) {
              upcoming.push({
                username: user.username,
                birthday: nextYearBirthday
              });
            }
          }
        }
        } catch (error) {
          console.error (`Error fetching data for friend`, error);
        }
      }

      upcoming.sort((a, b) => a.birthday - b.birthday);
      setUpcomingBirthdays(upcoming);
      };
    
      if (friends.length > 0) {
      getUpcomingBirthdays();
    }
  }, [friends, token]);

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
          <h1>{name}</h1>
          <MyCoffeeMates
            setUpdatePost={setUpdatePost}
            unapprovedFriendRequests={requests}
            unfilteredFriends={friends}
            filteredConfirmedFriends={filteredConfirmedFriends}
            coffeeMateQuery={coffeeMateQuery}
            setCoffeeMateQuery={setCoffeeMateQuery}
            upcomingBirthdays = {upcomingBirthdays}
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
