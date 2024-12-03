import DeletePostId from "./DeletePostButton";
import { deletePostId, likePost, UpdatePost, repostPost} from "../services/posts";
import EditPostButton from "./EditPostButton";
import { useState } from "react";
import LikePostButton from "./LikePostButton";
import { Link } from "react-router-dom";
import RepostButton from "./RepostButton";

function Post(props) {
  const token = localStorage.getItem("token");
  const [liked, setLiked] = useState(props.isLiked);
  const [editState, setEditState] = useState(false);
  const [postMessage, setPostMessage] = useState(props.message);
  const [isYours, setIsYours] = useState(props.isYours);
  const [friendsPosts, setFilter] = useState(false);
  const [reposted, setReposted] = useState(props.reposted);
  

  const handleChange = (event) => {
    setPostMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await UpdatePost(token, postMessage, props.post._id, props.isYours);
    props.updatePost(Math.random()); //change state to rerender page
    toggleEditState();
  };

  const toggleEditState = () => {
    setEditState((editState) => !editState);
  };

  const toggleLiked = async () => {
    await likePost(token, props.post._id);
    props.updatePost(Math.random());
    setLiked(() => !liked);
  };

  const cleanDate = new Date(props.timestamp)
    .toLocaleString("en-gb")
    .slice(0, -3)
    .replaceAll(",", "");

    const toggleFriendsPosts = () => {
      setFilter((friendsPosts) => !friendsPosts);
    };

    const handleRepost = async (event) => {
      event.preventDefault();
      await repostPost(token, props.post._id); 
      props.updatePost(Math.random());// Call the backend service
      setReposted(true); // Set the reposted state to true
       // Refresh the posts in the parent component
    };
  

  return editState ? (
    <div key="edit mode">
      <h2>{props.user}</h2>
      <h3>{cleanDate}</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={postMessage}
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
      <DeletePostId
        isYours={props.isYours}
        post_id={props.post._id}
        DeletePostId={deletePostId}
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
        key={props._id}
      >
        {props.message}
      </article>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
         <RepostButton reposted={reposted} onRepost={handleRepost} />
        <div>
          <LikePostButton
            liked={liked}
            toggleLiked={toggleLiked}
            beanNumber={props.beans.length}
          />
        </div>
        {isYours && (
          <div>
            <EditPostButton toggleEditState={toggleEditState} />
            <DeletePostId
              isYours={props.isYours}
              post_id={props.post._id}
              DeletePostId={deletePostId}
              UpdatePost={props.updatePost}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Post;
