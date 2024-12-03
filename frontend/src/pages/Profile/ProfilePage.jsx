import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Post from "../../components/Post";
import MyCoffeeMates from "../../components/MyCoffeeMates";

import { getFriendsForUser, getUnapprovedFriendsForUser } from "../../services/friends";
import { getYourPosts } from "../../services/posts";
import { getUserInfo } from "../../services/users";

import "./ProfilePage.css";

export function ProfilePage() {
    
    const token = localStorage.getItem("token");
    
    const [ name, setName ] = useState();
    const [ posts, setPosts ] = useState([]);
    const [ updatePost, setUpdatePost ] = useState(false);
    const [ friends, setFriends ] = useState([]);
    const [ requests, setRequests ] = useState([]);
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
                .then(data => setName(data.UserInfo.name))
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
        return friends.map((friend) => friend.sender == friend.user ? friend.receiver : friend.sender);
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

    return (
        <div className="wrapper-profile">

            <NavBar />
        
            <div className="sidebar-profile">

                <h1>{name}</h1>

                <MyCoffeeMates
                    setUpdatePost={setUpdatePost}
                    unapprovedFriendRequests={requests}
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
                        updatePost={setUpdatePost}
                        isYours={true}
                    />
                ))}
            </div>
        </div>
    );
}
