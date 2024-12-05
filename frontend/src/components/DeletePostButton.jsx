import { useConfirm } from "material-ui-confirm";
import { FaRegTrashCan } from "react-icons/fa6";

const DeletePostId = ({post_id, DeletePostId, UpdatePost, isYours, editState}) =>{

    const confirm = useConfirm()
    
    const token = localStorage.getItem("token");
    
    return (
        <button onClick={() => {
            confirm({ description: "Post will be permanently deleted!" })
            .then(() => {
                console.log("Awawa")
                DeletePostId(token, post_id, isYours)
                setTimeout(() => {UpdatePost(Math.random())}, 200)
            })
            .catch(() => {
                console.log("Post delete cancelled")
            })
        }}>Delete Post</button>
    )
    
};

export default DeletePostId;