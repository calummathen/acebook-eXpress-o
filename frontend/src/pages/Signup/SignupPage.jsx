import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function SignupPage() {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const chars = /[!@£$%]/;
    if (password.length < 8) {
      toast.error("Password must be 8 or more characters long");
    } else if (!chars.test(password)) {
      toast.error("Must contain at least 1 special character");
    } else {
      return true;
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (validatePassword(password)) {
      try {
        await signup(name, birthday, email, username, password);
        navigate("/login");
      } catch (err) {
        console.error(err);
        const errorMessage = err.message;

        if (errorMessage === "username") {
          toast.error("That username is taken, please try something else.");
        } else {
          if (errorMessage === "email") {
            toast.error(
              "An account with that email already exists, please login."
            );
          }
        }
        navigate("/signup");
      }
    }
  }

  function handleNameChange(event) {
    setName(event.target.value);
  }

  function handleBirthdayChange(event) {
    setBirthday(event.target.value);
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  const date18YearsAgo = new Date();
  date18YearsAgo.setFullYear(date18YearsAgo.getFullYear() - 18);
  const formattedDate = `${date18YearsAgo.getFullYear()}-${
    date18YearsAgo.getMonth() + 1
  }-${date18YearsAgo.getDate()}`;

  return (
    <>
      <ToastContainer />
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={handleNameChange}
        ></input>
        <label htmlFor="birthday">Birthday:</label>
        <input
          id="birthday"
          type="date"
          value={birthday}
          max={formattedDate}
          onChange={handleBirthdayChange}
        ></input>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={handleEmailChange}
        />
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        ></input>
        <label htmlFor="password">Password:</label>
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
        <input role="submit-button" id="submit" type="submit" value="Submit" />
      </form>
    </>
  );
}
