import DeletePostId from "./DeletePostButton";
import {deletePostId, UpdatePost} from "../services/posts"
import EditPostButton from "./EditPostButton";
import { useState } from "react";



function Post(props) {
  const token = localStorage.getItem("token");
  const [editState, setEditState] = useState(false)
  const [postMessage, setPostMessage] = useState(props.message);

  const handleChange = (event) => {
    setPostMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const EditPost = await UpdatePost(token, postMessage, props.post._id)
    props.updatePost(EditPost) //change state to rerender page
    toggleEditState()
  }
  
  const toggleEditState = () => {
    setEditState((editState) => !editState)
  }
  const cleanDate = new Date(props.timestamp)
    .toLocaleString("en-gb")
    .slice(0, -3)
    .replaceAll(",", "");
  return (
    editState ? (
      <div key="edit mode">
        <h2>{props.user}</h2>
        <h3>{cleanDate}</h3>
          <form onSubmit={handleSubmit}>
              <textarea
                value={postMessage}
                onChange={handleChange}
                rows="5" 
                cols="40" 
                style={{ width: '60%', height: '80px', resize: 'vertical' }} 
              />
              <div>
                <button type="submit">Confirm Edit</button>
              </div>
          </form>
        <DeletePostId 
        post_id = {props.post._id}
        DeletePostId = {deletePostId}
        UpdatePost = {props.updatePost}
        />
      </div>
      ) : (
      <div key="view mode">
        <h2>{props.user}</h2>
        <h3>{cleanDate}</h3>
        <article key={props._id}>{props.message}</article>
        <EditPostButton toggleEditState = {toggleEditState}/>
        <DeletePostId 
        post_id = {props.post._id}
        DeletePostId = {deletePostId}
        UpdatePost = {props.updatePost}
        />
      </div>

    )
  );
}

export default Post;
