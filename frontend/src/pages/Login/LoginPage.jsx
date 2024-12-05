import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { login } from "../../services/authentication";

import "./LoginPage.css";

export function LoginPage() {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");

    const navigate = useNavigate();
    
    async function handleSubmit(event) {

        event.preventDefault();

        if (email == "" && password == "") {
            toast.error("Please enter your credentials");
            return;
        } else if (email == "") {
            toast.error("Please enter your email");
            return;
        } else if (password == "") {
            toast.error("Please enter your password");
            return;
        }

        try {

            const token = await login(email, password);
            localStorage.setItem("token", token);
            navigate("/posts");

        } catch (err) {

            console.error(err);
            toast.error("Login failed. Please check your credentials.")
            setPassword("");

        }
    }
    
    return (
        <div className="wrapper-auth">

            <ToastContainer toastStyle={{ backgroundColor: "#E4E0E1", color: "#493628" }} />
    
            <div className="logo-auth">
                <h1>BeanScene</h1>
                <p>Stirring Up Your Social Life</p>
            </div>

            <div className="box-auth">
                <h2>Login</h2>

                <form onSubmit={handleSubmit} className="login">

                    <div className="login-form">

                        <label id="emailLabel" htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <label id="passwordLabel" htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="login-buttons">
                        <Link id="signup" to="/signup">Sign Up</Link>
                        <input
                            id="submit"
                            type="submit"
                            value="Login"
                            role="submit-button"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}
