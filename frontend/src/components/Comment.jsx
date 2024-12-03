import { deleteComment, likeComment, UpdateComment } from "../services/comments";
import { useState } from "react";
import { Link } from "react-router-dom";
import DeleteCommentButton from "./DeleteCommentButton";
import LikeCommentButton from "./LikeCommentButton"
import EditCommentButton from "./EditCommentButton"

function Comment(props) {
  const token = localStorage.getItem("token");
  const [liked, setLiked] = useState(props.isLiked);
  const [editState, setEditState] = useState(false);
  const [commentMessage, setCommentMessage] = useState(props.message);
  const [isYours, setIsYours] = useState(props.isYours);


  const handleChange = (event) => {
    setCommentMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await UpdateComment(token, commentMessage, props.id, props.isYours);
    props.updatePost(Math.random()); //change state to rerender page
    toggleEditState();
  };

  const toggleEditState = () => {
    setEditState((editState) => !editState);
  };

  const toggleLiked = async () => {
    await likeComment(token, props.id);
    props.updatePost(Math.random());
    setLiked(() => !liked);
  };

  const cleanDate = new Date(props.timestamp)
    .toLocaleString("en-gb")
    .slice(0, -3)
    .replaceAll(",", "");

  return editState ? (
    <div key="edit mode">
      <h2>{props.user}</h2>
      <h3>{cleanDate}</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={commentMessage}
          onChange={handleChange}
          rows="5"
          cols="40"
          style={{
            width: "60%",
            height: "80px",
            resize: "vertical",
          }}
        />
        <div>
          <button type="submit">Confirm Edit</button>
        </div>
      </form>
      <DeleteCommentButton
        isYours={props.isYours}
        comment_id={props.id}
        DeleteComment={deleteComment}
        UpdatePost={props.updatePost}
      />
    </div>
  ) : (
    <div key="view mode" style={{ margin: "30px" }}>
      <div style={{ display: "flex", gap: "10px" }}>
        <h2>
          <Link to={isYours ? "/profile" : `/profile/${props.user}`}>
            {props.user}
          </Link>
        </h2>
        <h3>{cleanDate}</h3>
      </div>
      <article
        style={{ border: "solid 1px", borderRadius: "10px", padding: "10px" }}
        key={props.id}
      >
        {props.message}
      </article>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <LikeCommentButton
            liked={liked}
            toggleLiked={toggleLiked}
            beanNumber={props.beans.length}
          />
        </div>
        {isYours && (
          <div>
            <EditCommentButton toggleEditState={toggleEditState} />
            <DeleteCommentButton
              isYours={props.isYours}
              comment_id={props.id}
              DeleteComment={deleteComment}
              UpdatePost={props.updatePost}
            />
          </div>
        )}
        <div></div>
      </div>
    </div>
  );
}

export default Comment;


