import { useLoaderData } from "react-router-dom"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserPosts } from "../../services/posts";
import Post from "../../components/Post";
import NavBar from "../../components/NavBar";
import { deleteFriend, getFriendsForAnotherUser, getUnapprovedFriendsForAnotherUser } from "../../services/friends";
import AddFriendButton from "../../components/AddFriendButton";
import { sendFriendRequest } from "../../services/friends";
import { getAnotherUserInfo } from "../../services/users";
import UserCoffeeMates from "../../components/UserCoffeeMates";

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
    const [requests, setRequests] = useState([]);
    const [loadedFriendsAndRequests, setLoadedFriendsAndRequests] = useState(false);
    const [friendRequestStatus, setFriendRequestStatus] = useState(0);

    const navigate = useNavigate();

    const [coffeeMateQuery, setCoffeeMateQuery] = useState("");
    const [filteredConfirmedFriends, setFilteredConfirmedFriends] = useState([]);  
  
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
          const fetchedRequests = await getUnapprovedFriendsForAnotherUser(token, username);
          setFriends(fetchedFriends.friends);
          setRequests(fetchedRequests.friends);
          setLoadedFriendsAndRequests(true);

        } catch (error) {
          console.error("Error fetching friends:", error.message);
        }
      };
  
      fetchFriends();
    }, [navigate, updatePost]); 

    useEffect(() => {
      if (!loadedFriendsAndRequests) {
        setFriendRequestStatus(0)
      } else if (friends.filter((request) => request.sender == request.user || request.receiver == request.user).length > 0) {
        setFriendRequestStatus(3)
      } else if (requests.filter((request) => request.sender == request.user).length > 0) {
        setFriendRequestStatus(2)
      } else {
        setFriendRequestStatus(1)
      }
    }, [friends, requests, updatePost])

    const getConfirmedFriends = () => {
      return friends.map((friend) =>
        friend.sender == username ? friend.receiver : friend.sender
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
          const data = await getAnotherUserInfo(token, username);
          setName(data.UserInfo.name);
        };
        fetchUserData();
      }
    }, [token]);

    async function addFriend() {
      await sendFriendRequest(token, username);
      setUpdatePost(Math.random())
    }
    
    async function deleteFriendAction() {
      const requestId = friends.find((friend) => friend.user === friend.sender)._id
      await deleteFriend(token, requestId)
      setUpdatePost(Math.random())
    }

    return (
      <div className="profile">
        <NavBar />
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
            <AddFriendButton
              friendRequestStatus={friendRequestStatus}
              sendFriendRequest={addFriend}
              deleteFriend={deleteFriendAction}
            />
            <UserCoffeeMates
              unfilteredFriends={friends}
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
              setUpdatePost={setUpdatePost}
              isYours={false}
              />
            ))}
          </div>
        </div>
      </div>
    );
}