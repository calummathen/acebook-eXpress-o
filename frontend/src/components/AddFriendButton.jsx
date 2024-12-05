import { useConfirm } from "material-ui-confirm";

const AddFriendButton = ({ friendRequestStatus, sendFriendRequest, deleteFriend }) => {
    const confirm = useConfirm()

    console.log(friendRequestStatus)
    if (friendRequestStatus == 1) {
        return (
            <button className="add-friend-button" onClick={sendFriendRequest}>Add Coffee Mate</button>
        )
    } else if (friendRequestStatus == 2) {
        return (
            <button className="add-friend-button" disabled>Coffee Mate Request Pending</button>
        )
    } else if (friendRequestStatus == 3) {
        return (
            <button className="add-friend-button" onClick={() => {

                confirm({ description: "Post will be permanently deleted!" })
                    .then(() => {
                        deleteFriend()
                    })
                    .catch(() => {
                        console.log("Post delete cancelled")
                    })
                }}>Remove Coffee Mate</button>
        )
    } else if (friendRequestStatus == 4) {
        return (
            <button className="add-friend-button" disabled>Coffee Mate Request Sent</button>
        )
    }
}

export default AddFriendButton;