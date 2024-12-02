import { useState, useEffect } from "react";
import { getUserInfo } from "../services/users";
import { updateUserInfo } from "../services/users"; 

function UserInfoTable({ user }) {
    const token = localStorage.getItem("token");
    const [editing, setEditing] = useState(false); 
    const [userData, setUserData] = useState(user); 

    // look into - one state as an array with all of these
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState(undefined);

    useEffect(() => {
        if (token) {
          const fetchUserData = async () => {
            const data = await getUserInfo(token);  
            setUserData(data.UserInfo);
          };
    
          fetchUserData();

        }
    }, [token]);

    useEffect(() => {
        if (userData) {
            setName(userData.name);
            setEmail(userData.email);
        }
    }, [userData])

    const toggleEdit = () => setEditing(!editing); 
    
    const handleSave = async () => {
        if (token) {
            const updatedData = {
                ...userData,
                name: name,
                email: email,
                password: password
            }
            await updateUserInfo(token, updatedData);  
            setUserData(updatedData)
            setEditing(false);
        }
    };

    const handleCancel = () => {
        setName(userData.name);
        setEmail(userData.email);  // Reset to the original user data
        setPassword(undefined)
        setEditing(false);  // Exit editing mode
    };

    return (
        <div>
            { (userData != undefined) && (
                <div>
                    { editing ? (
                        <form>
                            <div>
                                <p>Name:</p>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div>
                                <p>Email:</p>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <p>Password:</p>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </form>
                    ) : (
                        <div>
                            <div>
                                <p>Name:</p>
                                <p>{name}</p>
                            </div>
                            <div>
                                <p>Email:</p>
                                <p>{email}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div style={{ marginTop: "10px" }}>
                {editing ? (
                    <>
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel} style={{ marginLeft: "10px" }}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button onClick={toggleEdit}>Edit Profile</button>
                )}
            </div>
        </div>
    );
}

export default UserInfoTable;
