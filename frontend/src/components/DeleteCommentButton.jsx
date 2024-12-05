import { useConfirm } from "material-ui-confirm";
const DeleteCommentButton = ({comment_id, DeleteComment, UpdatePost, isYours}) =>{

  const token = localStorage.getItem("token");

  const confirm = useConfirm()
  
      return (
        <button onClick={() => {

          confirm({ description: "Comment will be permanently deleted!" })
              .then(() => {
                  DeleteComment(token, comment_id, isYours)
                  setTimeout(() => {UpdatePost(Math.random())}, 200)
              })
              .catch(() => {
                  console.log("Comment delete cancelled")
              })
      }}>Delete Comment</button>
    )
  
  };
  
  export default DeleteCommentButton;