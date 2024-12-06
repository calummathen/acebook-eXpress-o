import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUserInfo, getUsers } from "../services/users";

export const Search = () => {

    const token = localStorage.getItem("token");

    const [ query, setQuery ] = useState("");
    const [ users, setUsers ] = useState([]);
    const [ username, setUsername ] = useState("");
    const [ filteredUsers, setFilteredUsers ] = useState([]);
    
    const navigate = useNavigate();
    
    useEffect(() => {

        if (token) {

            getUserInfo(token)
                .then(data => setUsername(data.UserInfo.name))
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

            getUsers(token)
                .then((data) => {
                    setUsers(data.users);
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
    }, [token]);
    
    const createFilterUsers = (query, users) => {

        if (query.trim() === "") {
            return [];
        }
        
        const withoutUsername = users.filter((el) => {
            return !el.username.toLowerCase().includes(username);
        });
        return withoutUsername.filter((el) => {
            return el.username.toLowerCase().includes(query.toLowerCase());
        });
    };
    
    useEffect(() => {

        const result = createFilterUsers(query, users);
        setFilteredUsers(result);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);
    
    return (
        <div className="search-results-wrapper">
            <input
                type="text"
                placeholder="Search all coffee snobs"
                value={query}
                onChange={e => setQuery(e.target.value)}
            />

            <div className="search-results">
                
                {filteredUsers.map(el => (

                    <a key={el.username} href={`/profile/${el.username}`}>{el.username}</a>

                ))}
            </div>
        </div>
    );
};
