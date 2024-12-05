import { useState, useEffect } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Post from "../../components/Post";
import NavBar from "../../components/NavBar";
import AddFriendButton from "../../components/AddFriendButton";
import UserCoffeeMates from "../../components/UserCoffeeMates";

import { deleteFriend, getFriendsForAnotherUser, getUnapprovedFriendsForAnotherUser } from "../../services/friends";
import { getUserPosts } from "../../services/posts";
import { sendFriendRequest } from "../../services/friends";
import { getAnotherUserInfo } from "../../services/users";
import { useBeanScene } from "../../context/BeanSceneContext";


import "../Profile/ProfilePage.css";

export const loader = async ({ params }) => params.username

export function UserProfilePage() {
    
    const { theme } = useBeanScene();
    
    const token = localStorage.getItem("token");
    
    const username = useLoaderData()
    const [ name, setName ] = useState();
    const [ posts, setPosts ] = useState([]);
    const [ updatePost, setUpdatePost ] = useState(false);
    const [ friends, setFriends ] = useState([]);
    const [ requests, setRequests ] = useState([]);
    const [ loadedFriendsAndRequests, setLoadedFriendsAndRequests ] = useState(false);
    const [ friendRequestStatus, setFriendRequestStatus ] = useState(0);
    const [profileImage, setProfileImage] = useState();
    
    const navigate = useNavigate();
    
    const [coffeeMateQuery, setCoffeeMateQuery] = useState("");
    const [filteredConfirmedFriends, setFilteredConfirmedFriends] = useState([]);  
    
    useEffect(() => {

        if (token) {

            getUserPosts(token, username)
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

            getAnotherUserInfo(token, username)
            .then((data) => {
                setName(data.UserInfo.username);
                setProfileImage(data.UserInfo.profileImage);
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

        const fetchFriends = async () => {
            
            if (token) {

                try {

                    const fetchedFriends = await getFriendsForAnotherUser(token, username);
                    const fetchedRequests = await getUnapprovedFriendsForAnotherUser(token, username);

                    setFriends(fetchedFriends.friends);
                    setRequests(fetchedRequests.friends);

                    setLoadedFriendsAndRequests(true);
                    
                } catch (error) {
                    console.error("Error fetching friends:", error.message);
                }
            } else {
                navigate("/")
            }
        };
        
        fetchFriends();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, updatePost]); 
    
    useEffect(() => {

        requests.map(request => console.log(request))

        if (!loadedFriendsAndRequests) {
            setFriendRequestStatus(0)
        } else if (friends.filter((request) => request.sender == request.user|| request.receiver == request.user).length > 0) {
            setFriendRequestStatus(3)
        } else if (requests.filter((request) => request.sender == request.user).length > 0) {
            setFriendRequestStatus(2)
        } else if (requests.filter((request) => request.receiver == request.user).length > 0) {
            setFriendRequestStatus(4)
        } else {
            setFriendRequestStatus(1)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [friends, requests, updatePost])
    
    const getConfirmedFriends = () => {
        return friends.map((friend) => friend.sender == username ? friend.receiver : friend.sender);
    };

    const createFilteredConfirmedFriends = (query, allFriends) => {

        if (query.trim() === "") {
            return allFriends;
        }
    
        return allFriends.filter(el => el.toLowerCase().includes(query.toLowerCase()));
    };

    useEffect(() => {

        const confirmedFriends = getConfirmedFriends(friends);
        const result = createFilteredConfirmedFriends(coffeeMateQuery, confirmedFriends);

        setFilteredConfirmedFriends(result);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [coffeeMateQuery, friends]);

    async function addFriend() {
        await sendFriendRequest(token, username);
        setUpdatePost(Math.random())
    }

    async function deleteFriendAction() {
        const requestId = friends.find((friend) => friend.user === friend.sender || friend.user === friend.receiver)?._id;
        await deleteFriend(token, requestId)
        setUpdatePost(Math.random())
    }

    console.log(profileImage)
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    return (
        <div className={`wrapper-profile ${theme === "light" ? "wrapper-profile-light" : "wrapper-profile-dark"}`}>
    
            <NavBar />

            <div className="sidebar-profile">

                <h1>{name}</h1>
<img  src={`${BACKEND_URL}/${profileImage}`} alt="Profile Picture"></img>

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

            <div className="posts-profile">

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
    )
}