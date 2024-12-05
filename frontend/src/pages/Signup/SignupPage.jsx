import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { signup } from "../../services/authentication";

import "./SignupPage.css";

export function SignupPage() {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);

  console.log(file);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const chars = /[!#$%&'()*+,\-:;<=>?@£÷]/;

    if (password == "") {
      toast.error("Please enter a password");
    } else if (password !== confirmPassword) {
      toast.error("Passwords must match");
    } else if (password.length < 8) {
      toast.error("Password must be 8 or more characters long");
    } else if (!chars.test(password)) {
      toast.error("Password must contain at least 1 special character");
    } else {
      return true;
    }
  };

  const validateUsername = (username) => {
    if (!username) {
      toast.error("Please enter a username");
      return false;
    }

    return true;
  };

  const validateEmail = (email) => {
    // Check if email contains "@" and "."
    // "||" MEANS "OR"

    if (!email || !email.includes("@") || !email.includes(".")) {
      toast.error("Please enter a valid email address with an '@' and '.'");
      return false;
    }

    return true;
  };

  const validateBirthday = (birthday) => {
    if (!birthday) {
      toast.error("Please enter your birthday");
      return false;
    }

    return true;
  };

  const validateName = (name) => {
    if (!name) {
      toast.error("Please enter your name");
      return false;
    }

    return true;
  };

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      validatePassword(password) &&
      validateUsername(username) &&
      validateEmail(email) &&
      validateBirthday(birthday) &&
      validateName(name)
    ) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("birthday", birthday);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);

      if (file) {
        formData.append("file", file); // Append the profile image if it exists
      }
      try {
        await signup(formData);
        navigate("/");
      } catch (err) {
        console.error(err);
        const errorMessage = err.message;

        if (errorMessage === "username") {
          toast.error("That username is taken, please try something else");
        } else if (errorMessage === "email") {
          toast.error(
            "An account with that email already exists, please login."
          );
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }

        setPassword("");
        setConfirmPassword("");
      }
    }
  }

  const date18YearsAgo = new Date();
  date18YearsAgo.setFullYear(date18YearsAgo.getFullYear() - 18);

  const formattedDate = `${date18YearsAgo.getFullYear()}-${(
    date18YearsAgo.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${date18YearsAgo.getDate().toString().padStart(2, "0")}`;

  return (
    <div className="wrapper-auth">
      <ToastContainer
        toastStyle={{ backgroundColor: "#E4E0E1", color: "#493628" }}
      />

      <div className="logo-auth">
        <h1>BeanScene</h1>
        <p>Stirring Up Your Social Life</p>
      </div>

      <div className="box-auth">
        <h2>Signup</h2>

        <form onSubmit={handleSubmit} className="signup">
          <label id="usernameLabel" htmlFor="username">
            Username:
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label id="emailLabel" htmlFor="email">
            Email:
          </label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label id="nameLabel" htmlFor="name">
            Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label id="birthdayLabel" htmlFor="birthday">
            Birthday:
          </label>
          <input
            id="birthday"
            type="date"
            value={birthday}
            max={formattedDate}
            onChange={(e) => setBirthday(e.target.value)}
          />

          <label id="passwordLabel" htmlFor="password">
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label id="confirmPasswordLabel" htmlFor="password">
            Confirm Password:
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <label id="profileImageLabel" htmlFor="profileImage">
            Profile Image:
          </label>
          <input
            id="profileImage"
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <Link id="login" to="/">
            Login
          </Link>
          <input
            role="submit-button"
            id="submit"
            type="submit"
            value="Sign Up"
          />
        </form>
      </div>
    </div>
  );
}
