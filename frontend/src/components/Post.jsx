import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { deletePostId, likePost, UpdatePost, repostPost, disableCommentsOnPost} from "../services/posts";
import { getCommentsforPost } from "../services/comments";
import { useBeanScene } from "../context/BeanSceneContext";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import TextareaAutosize from 'react-textarea-autosize';

import LikePostButton from "./LikePostButton";
import RepostButton from "./RepostButton";
import EditPostButton from "./EditPostButton";
import CancelEditButton from "./CancelEditButton";
import DeletePostId from "./DeletePostButton";
import Comment from "./Comment";
import AddCommentToPost from "./AddCommentButton";
import DisableCommentsButton from "./DisableCommentsButton";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { BiRepost } from "react-icons/bi";

import "./Post.css";
import ConfirmEditPostButton from "./ConfirmEditPostButton";

function Post(props) {

    const { theme } = useBeanScene();

    const token = localStorage.getItem("token");

    const post = props.post
    const [ isYours ] = useState(post.isYours);
    const [ postMessage, setPostMessage ] = useState(post.message);
    const [ liked, setLiked ] = useState(post.hasLiked);
    const [ commentable, setCommentable ] = useState(false);
    const [ commentsEnabled, setCommentsEnabled ] = useState(post.comments)
    const [ comments, setComments ] = useState([]);
    const [ updateComments, setUpdateComments ] = useState(false)
    const [ reposted, setReposted ] = useState(post.hasReposted);  
    const [ editState, setEditState ] = useState(false);

    const navigate = useNavigate();
    
    useEffect(() => {

        if (token) {

            getCommentsforPost(token, post._id)
                .then((data) => {
                    setComments(data.comments);
                    localStorage.setItem("token", data.token);
                })
                .catch((err) => {
                    console.error(err);
                    navigate("/");
                });

        } else {
            navigate("/");
        } 

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, updateComments])
    
    const toggleEditState = () => setEditState(!editState);

    const handleEdit = async () => {

        await UpdatePost(token, postMessage, post._id, post.isYours);
        props.setUpdatePost(Math.random());
        toggleEditState();

    }; 

    const cancelEdit = async () => {

        setPostMessage(post.message)
        props.setUpdatePost(Math.random());
        toggleEditState();
    }
    
    const toggleLiked = async () => {

        await likePost(token, post._id);
        props.setUpdatePost(Math.random());
        setLiked(() => !liked);

    };
    
    const toggleCommentsEnabled = async () => {

        await disableCommentsOnPost(token, !commentsEnabled, post._id, post.isYours)
        props.setUpdatePost(Math.random())
        setCommentsEnabled(!commentsEnabled);

    };

    const handleRepost = async () => {

        await repostPost(token, post._id); 
        props.setUpdatePost(Math.random());
        setReposted(true);

    };

    const cleanDate = new Date(post.timestamp)
        .toLocaleString("en-gb")
        .slice(0, -3)
        .replaceAll(",", "");

    return (
        <div className={`post ${theme === "light" ? "post-light" : "post-dark"}`}>
            <div className="post-header">
                <div>
                    <Link className="post-header-name" to={
                        post.isYours ? "/profile" : `/profile/${post.user}`
                    }>
                        {post.user}
                    </Link>

                    { (post.repostedFrom !== undefined) && (
                        <div className="post-reposted-from">
                            <BiRepost />
                            <p>from: 
                                <Link className="post-header-name" to={
                                    post.hasReposted ? "/profile" : `/profile/${post.repostedFrom}`
                                }>
                                    {post.repostedFrom}
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
                <p>{cleanDate}</p>
            </div>
            <div className="post-body">
                { editState ? (
                    <TextareaAutosize
                        value={postMessage}
                        onChange={e => setPostMessage(e.target.value)}
                        rows={1}
                    />
                ) : (
                    <p>{postMessage}</p>
                )}
            </div>
            <div className="post-actions">
                <div>
                    <LikePostButton
                        liked={liked}
                        toggleLiked={toggleLiked}
                        beanNumber={post.beans.length}
                        editState={editState}
                    />

                    <RepostButton
                        reposted={reposted} 
                        onRepost={handleRepost}
                        editState={editState}
                    />

                    {/* TOdo: comments */}
                </div>

                { isYours && (
                    <div>
                        <DisableCommentsButton
                            commentsEnabled={commentsEnabled}
                            toggleCommentsEnabled={toggleCommentsEnabled}
                            setUpdatePost={props.setUpdatePost} 
                            editState={editState}
                        />
                        
                        { editState ? (
                            <>
                                <ConfirmEditPostButton
                                    handleEdit={handleEdit}
                                />

                                <CancelEditButton
                                    cancelEdit={cancelEdit}
                                />
                            </>
                        ) : (
                            <EditPostButton
                                toggleEditState={toggleEditState}
                            />
                        )}

                        <DeletePostId
                            isYours={props.isYours}
                            post_id={props.post._id}
                            DeletePostId={deletePostId}
                            UpdatePost={props.setUpdatePost}
                            editState={editState}
                        />
                    </div>
                )}
            </div>
            <div className="post-comments">
            </div>
        </div>
    )
    
    // return editState ? (
    //     <div key="edit mode">
    //     <h2>{props.user}</h2>
    //     <h3>{cleanDate}</h3>
    //     <form onSubmit={handleEdit}>
    //     <textarea
    //     value={postMessage}
    //     onChange={e => setPostMessage(e.target.value)}
    //     rows="5"
    //     cols="40"
    //     style={{
    //         width: "60%",
    //         height: "80px",
    //         resize: "vertical",
    //     }}
    //     />
    //     <div>
    //     <button type="submit">Confirm Edit</button>
    //     </div>
    //     </form>
    //     <CancelEditButton setUpdatePost = {props.setUpdatePost} toggleEditState={toggleEditState}/>
    //     <DeletePostId
    //     isYours={props.isYours}
    //     post_id={props.post._id}
    //     DeletePostId={deletePostId}
    //     UpdatePost={props.setUpdatePost}
    //     />
    //     </div>
    // ) : (
    //     <div key="view mode" style={{ margin: "30px" }}>
    //     <div style={{ display: "flex", gap: "10px" }}>
    //     <h2>
    //     <Link to={isYours ? "/profile" : `/profile/${props.user}`}>
    //     {props.user}
    //     </Link>
    //     </h2>
    //     <h3>{cleanDate}</h3>
    //     </div>
    //     <article
    //     style={{ border: "solid 1px", borderRadius: "10px", padding: "10px" }}
    //     key={props._id}
    //     >
    //     {props.message}
    //     </article>
    //     <div
    //     style={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //     }}
    //     >
    //     <RepostButton reposted={reposted} onRepost={handleRepost} />
    //     {props.post.comments ? (
    //         <div>
    //         <AddCommentToPost
    //         UpdatePost={setUpdateComments}
    //         setCommentable={setCommentable}
    //         commentable={commentable}
    //         postId={props.post._id}
    //         />
    //         </div>
    //     ) : ( 
    //         "🚫 Comments have been disabled 🚫"
    //     )}
    //     <div>
    //     </div>
    //     <div>
    //     <LikePostButton
    //     liked={liked}
    //     toggleLiked={toggleLiked}
    //     beanNumber={props.beans.length}
    //     />
    //     </div>
    //     {isYours && (
    //         <div>
    //             <DisableCommentsButton
    //             commentsEnabled={commentsEnabled}
    //             toggleCommentsEnabled={toggleCommentsEnabled}
    //             setUpdatePost={props.setUpdatePost} 
    //             />
    //         <EditPostButton toggleEditState={toggleEditState} />
    //         <DeletePostId
    //         isYours={props.isYours}
    //         post_id={props.post._id}
    //         DeletePostId={deletePostId}
    //         UpdatePost={props.setUpdatePost}
    //         />
    //         </div>
    //     )}
    //     <div className="comments" role="feed">
        
    //     {comments.length > 0 && props.post.comments && (
    //         <Accordion
    //         style={{
    //             display: "flex",
    //             flexDirection: "column",
    //         }}
    //         >
    //         <AccordionSummary
    //         expandIcon={<ArrowDownwardIcon />}
    //         aria-controls="panel1-content"
    //         id="panel1-header"
    //         >
    //         <Typography>Comments</Typography>
    //         </AccordionSummary>
    //         <AccordionDetails
    //         style={{
    //             display: "flex",
    //             flexDirection: "column",
    //             alignItems: "start",
    //             gap: "10px",
    //         }}
    //         >
    //         {comments.map((comment) => (
    //             <div key={comment._id}>
    //             <a href={`/profile/${comment.user}`}></a>
    //             <Comment
    //             id={comment._id}
    //             post_id={comment.post_id}
    //             user={comment.user}
    //             message={comment.message}
    //             timestamp={comment.timestamp}
    //             isLiked={comment.hasLiked}
    //             beans={comment.beans}
    //             updatePost={setUpdateComments}
    //             isYours={comment.isYours}
    //             />
    //             </div>
    //         ))}
    //         </AccordionDetails>
    //         </Accordion>
    //     )}
        
    //     </div>
    //     </div>
    //     </div>
    // );
}

export default Post;
