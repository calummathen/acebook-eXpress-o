import { useConfirm } from "material-ui-confirm";
import { FaRegTrashCan } from "react-icons/fa6";

const DeleteCommentButton = ({comment_id, DeleteComment, UpdatePost, isYours, editState}) => {

    const confirm = useConfirm()
    
    const token = localStorage.getItem("token");
    
    return (
        <button className="post-comment-delete-button" onClick={() => {

            confirm({ description: "Comment will be permanently deleted!" })
                .then(() => {
                    DeleteComment(token, comment_id, isYours)
                    setTimeout(() => {UpdatePost(Math.random())}, 200)
                })
                .catch(() => {
                    console.log("Comment delete cancelled")
                })
        }} disabled={editState}>
            <FaRegTrashCan />
        </button>
    )
    
};

export default DeleteCommentButton;