
import { useState } from "react";
import { CreateComment } from "../services/comments";

const AddCommentToPost = ({ commentable, setCommentable, UpdatePost, postId }) => {
  const token = localStorage.getItem("token");

  const [commentMessage, setCommentMessage] = useState("");

  const handleChange = (event) => {
    setCommentMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const CreatedComment = await CreateComment(token, commentMessage, postId)
    UpdatePost(CreatedComment)
    setCommentMessage("");
  }

  return commentable ? (
    <form onSubmit={handleSubmit}>
      <label>
        Write your comment:
          <input
            type="text"
            value={commentMessage}
            onChange={handleChange}
          />
      </label>
      <button type="submit">Submit</button>
    </form>
  ) : (
    <button
      onClick={() => {
        setCommentable(!commentable);
      }}
    >
      {commentable ? "Cancel Comment" : "Add Comment"}
    </button>
  );
};

export default AddCommentToPost;
