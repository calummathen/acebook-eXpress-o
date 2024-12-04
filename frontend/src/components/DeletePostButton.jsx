import { useConfirm } from "material-ui-confirm";

const DeletePostId = ({post_id, DeletePostId, UpdatePost, isYours}) =>{
  const confirm = useConfirm()

  const token = localStorage.getItem("token");
    return (
      <button onClick={() => {
        confirm({ description: "Post will be permanently deleted!" })
          .then(() => {
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