import { deleteFriend } from "../services/friends";

const DenyFriendRequestButton = ({ friendRequestId, setUpdatePost}) => {
    const token = localStorage.getItem("token");
    
    const handleDeny = async () => {

        try {

            await deleteFriend(token, friendRequestId);
            setUpdatePost(friendRequestId)

        } catch (error) {

            console.error("Error denying friend request:", error);

        }
    };
    
    return (
        <button onClick={handleDeny}>Deny</button>
    );
};

export default DenyFriendRequestButton;
