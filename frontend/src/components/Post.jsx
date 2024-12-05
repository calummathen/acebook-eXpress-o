import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { deletePostId, likePost, UpdatePost, repostPost, disableCommentsOnPost} from "../services/posts";
import { getCommentsforPost } from "../services/comments";
import { useBeanScene } from "../context/BeanSceneContext";

import TextareaAutosize from 'react-textarea-autosize';

import LikePostButton from "./LikePostButton";
import RepostButton from "./RepostButton";
import EditPostButton from "./EditPostButton";
import CancelEditButton from "./CancelEditButton";
import DeletePostId from "./DeletePostButton";
import Comment from "./Comment";
import AddCommentToPost from "./AddCommentButton";
import DisableCommentsButton from "./DisableCommentsButton";
import ConfirmEditPostButton from "./ConfirmEditPostButton";
import ConmmentViewPostButton from "./CommentViewPost";

import { BiRepost } from "react-icons/bi";

import "./Post.css";

function Post(props) {

    const { theme } = useBeanScene();

    const token = localStorage.getItem("token");

    const post = props.post
    const [ isYours ] = useState(post.isYours);
    const [ postMessage, setPostMessage ] = useState(post.message);
    const [ liked, setLiked ] = useState(post.hasLiked);
    const [ commentsEnabled, setCommentsEnabled ] = useState(post.comments)
    const [ comments, setComments ] = useState([]);
    const [ updateComments, setUpdateComments ] = useState(false)
    const [ showComments, setShowComments ] = useState(false)
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
        ( comments.length == 0 ) && setShowComments(false)

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
                                <Link className="post-header-name" to={`/profile/${post.repostedFrom}`}>
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

                    <ConmmentViewPostButton
                        toggleComments={() => setShowComments(!showComments)}
                        comments={comments}
                        editState={editState}
                        commentsEnabled={commentsEnabled}
                    />
                </div>

                { isYours && (
                    <div>
                        <DisableCommentsButton
                            commentsEnabled={commentsEnabled}
                            toggleCommentsEnabled={toggleCommentsEnabled}
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
                            isYours={post.isYours}
                            post_id={post._id}
                            DeletePostId={deletePostId}
                            UpdatePost={props.setUpdatePost}
                            editState={editState}
                        />
                    </div>
                )}
            </div>
            {
                (showComments && (
                    <div className="post-comments">
                        { comments.map((comment) => (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                updatePost={setUpdateComments}
                            />
                        ))}

                        { commentsEnabled && (
                            <AddCommentToPost
                                postId={post._id}
                                UpdatePost={setUpdateComments}
                            />
                        )}
                    </div>
                ))
            }
        </div>
    )
}

export default Post;
