import { useState } from "react";
import { CreatePost } from "../services/posts";

const NewPostForm = ({token, setUpdatePost}) => {

  const [postMessage, setPostMessage] = useState("");

  const handleChange = (event) => {
    setPostMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const CreatedPost = await CreatePost(token, postMessage)
    setUpdatePost(CreatedPost)
    setPostMessage("");
  }


  return (
    <form onSubmit={handleSubmit} className="post-feedpage-new-post">
      <label htmlFor="new-post">Spill the beans:</label>
          <textarea
            id="new-post"
            type="text"
            value={postMessage}
            onChange={handleChange}
            placeholder="Expresso yourself..."
            rows={4}
            cols={40}
          />
      <button type="submit" disabled={postMessage == ""}>Post</button>
    </form>
  )
}

export default NewPostForm;