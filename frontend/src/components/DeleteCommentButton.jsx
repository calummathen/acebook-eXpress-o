
const DeleteCommentButton = ({comment_id, DeleteComment, UpdatePost, isYours}) =>{
  const token = localStorage.getItem("token");
      return (
        <button onClick={() => { 
          DeleteComment(token, comment_id, isYours)
          setTimeout(() => {UpdatePost(Math.random())}, 200)
          }}>Delete Comment</button>
    )
  
  };
  
  export default DeleteCommentButton;