const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Post from "../../components/Post";
import MyCoffeeMates from "../../components/MyCoffeeMates";
import {
  getFriendsForUser,
  getUnapprovedFriendsForUser,
} from "../../services/friends";
import { getYourPosts } from "../../services/posts";
import { getUserInfo, getUserByUsername } from "../../services/users";
import { useBeanScene } from "../../context/BeanSceneContext";

import "./ProfilePage.css";

export function ProfilePage() {
  const { theme } = useBeanScene();

  const token = localStorage.getItem("token");

  const [profileImage, setProfileImage] = useState();
  const [name, setName] = useState();
  const [posts, setPosts] = useState([]);
  const [updatePost, setUpdatePost] = useState(false);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [coffeeMateQuery, setCoffeeMateQuery] = useState("");
  const [filteredConfirmedFriends, setFilteredConfirmedFriends] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      getYourPosts(token)
        .then((data) => {
          setPosts(data.posts);
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

  useEffect(() => {
    if (token) {
      getUserInfo(token)
        .then((data) => {
          setName(data.UserInfo.username);
          const profilePic = data.UserInfo.profileImage || "/images/default_profile_pic.jpeg";
          setProfileImage(profilePic);
        })
        .catch((err) => {
          console.log(err);
          navigate("/");
        
        });
    } else {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (token) {
      getFriendsForUser(token)
        .then((data) => {
          setFriends(data.friends);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/");
        });

      getUnapprovedFriendsForUser(token)
        .then((data) => {
          setRequests(data.friends);
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

  const getConfirmedFriends = () => {
    return friends.map((friend) =>
      friend.sender == friend.user ? friend.receiver : friend.sender
    );
  };

  const createFilteredConfirmedFriends = (query, allFriends) => {
    if (query.trim() === "") {
      return allFriends;
    }

    return allFriends.filter((el) =>
      el.toLowerCase().includes(query.toLowerCase())
    );
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
    const getUpcomingBirthdays = async () => {
      const today = new Date();
      let upcoming = [];

      for (const friend of friends) {
        try {
          const friendUsername =
            friend.sender === friend.user ? friend.receiver : friend.sender;
          const user = await getUserByUsername(friendUsername, token);

          if (user && user.birthday) {
            const birthday = new Date(user.birthday);

            const thisYearBirthday = new Date(
              today.getFullYear(),
              birthday.getMonth(),
              birthday.getDate()
            );

            const thirtyDaysFromToday = new Date(
              today.getTime() + 30 * 24 * 60 * 60 * 1000
            );

            // Check if the birthday is within the next 30 days
            // Ensure that if the birthday date is in the past (before today), we add one year to it
            if (
              thisYearBirthday >= today &&
              thisYearBirthday <= thirtyDaysFromToday
            ) {
              upcoming.push({
                username: user.username,
                birthday: thisYearBirthday,
              });
            } else {

              const nextYearBirthday = new Date(
                today.getFullYear() + 1,
                birthday.getMonth(),
                birthday.getDate()
              );

              if (
                nextYearBirthday >= today &&
                nextYearBirthday <= thirtyDaysFromToday
              ) {
                upcoming.push({
                  username: user.username,
                  birthday: nextYearBirthday,
                });
              }
            }
          }
        } catch (error) {
          console.error(`Error fetching data for friend`, error);
        }
      }

      upcoming.sort((a, b) => a.birthday - b.birthday);
      setUpcomingBirthdays(upcoming);
    };

    if (friends.length > 0) {
      getUpcomingBirthdays();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [friends, token]);
    
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    
    return (
        <div className={`wrapper-profile ${theme === "light" ? "wrapper-profile-light" : "wrapper-profile-dark"}`}>

            <NavBar />
        
            <div className="sidebar-profile">
                <img  src={`${BACKEND_URL}/${profileImage}`} alt="Profile Picture"></img>
                <h1>{name}</h1>
                <img  src={`${BACKEND_URL}/${profileImage}`} alt="Profile Picture"></img>
                <MyCoffeeMates
                    setUpdatePost={setUpdatePost}
                    unapprovedFriendRequests={requests}
                    unfilteredFriends={friends}
                    filteredConfirmedFriends={filteredConfirmedFriends}
                    coffeeMateQuery={coffeeMateQuery}
                    setCoffeeMateQuery={setCoffeeMateQuery}
                    upcomingBirthdays={upcomingBirthdays}
                />
            </div>
            <div className="posts-profile">

                { posts.map((post) => (
                    <Post
                        key={post._id}
                        post={post}
                        setUpdatePost={setUpdatePost}
                    />
                ))}

            </div>
        </div>
    );
}
