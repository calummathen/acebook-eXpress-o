import { approveFriendRequest } from "../services/friends";

const ApproveFriendRequestButton = ({ friendRequestId, setUpdatePost}) => {
    const token = localStorage.getItem("token");
    
    const handleApprove = async () => {

        try {
            await approveFriendRequest(token, friendRequestId);
            setUpdatePost(friendRequestId)

        } catch (error) {

            console.error("Error approving friend request:", error);

        }
    };
    
    return (
        <button onClick={handleApprove}>Approve</button>
    );
};

export default ApproveFriendRequestButton;
