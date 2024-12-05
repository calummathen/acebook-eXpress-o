import { useConfirm } from "material-ui-confirm";
import { deleteFriend } from "../services/friends";

const DenyFriendRequestButton = ({ friendRequestId, setUpdatePost}) => {
    const token = localStorage.getItem("token");
    const confirm = useConfirm()

    const handleDeny = async () => {

        try {

            await deleteFriend(token, friendRequestId);
            setUpdatePost(friendRequestId)

        } catch (error) {

            console.error("Error denying friend request:", error);

        }
    };
    
    return (
        <button 
        onClick={() => {

            confirm({ description: "Friendship request will be denied!" })
                .then(() => {
                    handleDeny()
                })
                .catch(() => {
                    console.log("Friendship deny cancelled")
                })
            }}>Deny
        </button>
    );
};

export default DenyFriendRequestButton;
