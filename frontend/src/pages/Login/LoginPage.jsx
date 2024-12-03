import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login } from "../../services/authentication";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./LoginPage.css";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const token = await login(email, password);
      localStorage.setItem("token", token);
      navigate("/posts");
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please check your credentials.")
      navigate("/");
    }
  }

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  return (
    <div className="wrapper">
      <ToastContainer toastStyle={{ backgroundColor: "#E4E0E1", color: "#493628" }} />
      <div className="logo">
        <h1>BeanScene</h1>
        <p>Stirring Up Your Social Life</p>
      </div>
      <div className="box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
          />
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <div>
            <Link id="signup" to="/signup">Sign Up</Link>
          </div>
          <div>
            <input role="submit-button" id="submit" type="submit" value="Login" />
          </div>
        </form>
      </div>
    </div>
  );
}
