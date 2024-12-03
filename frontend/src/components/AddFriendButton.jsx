const AddFriendButton = ({ friendRequestStatus, sendFriendRequest, deleteFriend }) => {
    
    if (friendRequestStatus == 1) {
        return (
            <button onClick={sendFriendRequest}>Add Coffee Mate</button>
        )
    } else if (friendRequestStatus == 2) {
        return (
            <button disabled>Coffee Mate Request Pending</button>
        )
    } else if (friendRequestStatus == 3) {
        return (
            <button onClick={deleteFriend}>Remove Coffee Mate</button>
        )
    }
}

export default AddFriendButton;