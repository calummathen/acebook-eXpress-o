import DeletePostId from "./DeletePostButton";
import { deletePostId, likePost, UpdatePost, repostPost} from "../services/posts";
import EditPostButton from "./EditPostButton";
import { useState, useEffect } from "react";
import LikePostButton from "./LikePostButton";
import RepostButton from "./RepostButton";
import { Link, useNavigate } from "react-router-dom";
import AddCommentToPost from "./AddCommentButton";
import Comment from "./Comment";
import { getCommentsforPost } from "../services/comments";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

function Post(props) {
  const token = localStorage.getItem("token");
  const [liked, setLiked] = useState(props.isLiked);
  const [editState, setEditState] = useState(false);
  const [postMessage, setPostMessage] = useState(props.message);
  const [comments, setComments] = useState([]);
  const [isYours, setIsYours] = useState(props.isYours);
  const [commentable, setCommentable] = useState(false);
  const [updateComments, setUpdateComments] = useState(false)
  const navigate = useNavigate();
  const [friendsPosts, setFilter] = useState(false);
  const [reposted, setReposted] = useState(props.hasReposted);  


  useEffect(() => {
    const fetchComments = async () => {
      const token = localStorage.getItem("token");
      const loggedIn = token !== null;
  
      if (!loggedIn) {
        navigate("/login");
        return;
      }
  
      try {
        const data = await getCommentsforPost(token, props.post._id);
        setComments(data.comments);
        localStorage.setItem("token", data.token);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    };
  
    fetchComments();
  }, [navigate, props.post._id, updateComments]);

  const handleChange = (event) => {
    setPostMessage(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await UpdatePost(token, postMessage, props.post._id, props.isYours);
    props.setUpdatePost(Math.random()); //change state to rerender page
    toggleEditState();
  };

  const toggleEditState = () => {
    setEditState((editState) => !editState);
  };

  const toggleLiked = async () => {
    await likePost(token, props.post._id);
    props.setUpdatePost(Math.random());
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
      //event.preventDefault();
      await repostPost(token, props.post._id); 
      props.setUpdatePost(Math.random());// Call the backend service
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
        UpdatePost={props.setUpdatePost}
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
          <AddCommentToPost
            UpdatePost={setUpdateComments}
            setCommentable={setCommentable}
            commentable={commentable}
            postId={props.post._id}
          />
        </div>
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
              UpdatePost={props.setUpdatePost}
            />
          </div>
        )}
      <div className="comments" role="feed">
        
      {comments.length > 0 && (
        <Accordion
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AccordionSummary
            expandIcon={<ArrowDownwardIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography>Comments</Typography>
          </AccordionSummary>
          <AccordionDetails
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              gap: "10px",
            }}
          >
            {comments.map((comment) => (
              <div key={comment._id}>
                <a href={`/profile/${comment.user}`}></a>
                <Comment
                  id={comment._id}
                  post_id={comment.post_id}
                  user={comment.user}
                  message={comment.message}
                  timestamp={comment.timestamp}
                  isLiked={comment.hasLiked}
                  beans={comment.beans}
                  updatePost={setUpdateComments}
                  isYours={comment.isYours}
                />
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      )}

      </div>
      </div>
    </div>
  );
}

export default Post;
