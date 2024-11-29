import { useState, useEffect } from "react";
import { getUserInfo } from "../services/users";
import { updateUserInfo } from "../services/users"; 

function UserInfoTable({ user }) {
    const token = localStorage.getItem("token");
    const [editing, setEditing] = useState(false); 
    const [userData, setUserData] = useState(user); 

    useEffect(() => {
        if (token) {
          const fetchUserData = async () => {
            const data = await getUserInfo(token);  
            setUserData(data);
          };
    
          fetchUserData();
        }
    }, [token]);

    const handleChange = (new_value, key) => {
        setUserData({ ...userData, [key]: new_value.target.value });
    };

    const toggleEdit = () => setEditing(!editing); 
    
    const handleSave = async () => {
        if (token) {
            await updateUserInfo(token, userData);  
            setEditing(false);
        }
    };

    const handleCancel = () => {
        setUserData(user);  // Reset to the original user data
        setEditing(false);  // Exit editing mode
    };

    return (
        <div>
            <table border="1" style={{ width: "100%", textAlign: "left" }}>
                <tbody>
                    {Object.keys(userData).map((key) => (
                        <tr key={key}>
                            <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                            <td>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={userData[key] || ""}
                                        onChange={(new_value) => handleChange(new_value, key)}
                                    />
                                ) : (
                                    userData[key] || "N/A"
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
