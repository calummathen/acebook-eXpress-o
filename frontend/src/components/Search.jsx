import { useEffect, useState } from "react";
import { getUsers } from "../services/users";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getUsers(token)
        .then((data) => {
          setUsers(data.users);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  console.log("filtered users:  ", filteredUsers);

  const createFilterUsers = (query, users) => {
    if (query.trim() === "") {
      return [];
    }
    return users.filter((el) => {
      return el.username.toLowerCase().includes(query.toLowerCase());
    });
  };

  useEffect(() => {
    const result = createFilterUsers(query, users);
    setFilteredUsers(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        height: "50vh",
        width: "50vw",
        position: "absolute",
        top: 0,
        right: 0,
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
        marginTop: "70px",
        background: "black",
        opacity: "90%",
        overflow: "hidden",
        borderBottomLeftRadius: "5%",
      }}
    >
      <input
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "4px",
          justifySelf: "start",
        }}
        type="text"
        placeholder="search all coffee snobs"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          margin: 0,
          maxHeight: "300px",
          overflowY: "auto",
          width: "100%",
          maxWidth: "400px",
          color: "white",
        }}
      >
        {filteredUsers.map((el, index) => (
          <li key={index}>{el.username}</li>
        ))}
      </ul>
    </div>
  );
};
