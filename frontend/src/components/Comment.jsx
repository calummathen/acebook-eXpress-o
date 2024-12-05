import { deleteComment, likeComment, UpdateComment } from "../services/comments";
import { useState } from "react";
import { Link } from "react-router-dom";
import DeleteCommentButton from "./DeleteCommentButton";
import LikeCommentButton from "./LikeCommentButton"
import EditCommentButton from "./EditCommentButton"
import { TextareaAutosize } from "@mui/material";
import ConfirmEditCommentButton from "./ConfirmEditCommentButton";
import CancelEditCommentButton from "./CancelCommentEditButton";

function Comment(props) {

    const token = localStorage.getItem("token");

    const comment = props.comment;

    const [ isYours ] = useState(comment.isYours);
    const [ commentMessage, setCommentMessage ] = useState(comment.message);
    const [ liked, setLiked ] = useState(comment.hasLiked);
    const [ editState, setEditState ] = useState(false);
    
    const toggleEditState = () => setEditState(!editState);

    const handleEdit = async () => {

        await UpdateComment(token, commentMessage, comment._id, comment.isYours);
        props.updatePost(Math.random());
        toggleEditState();
    }

    const cancelEdit = async () => {

        setCommentMessage(comment.message)
        props.updatePost(Math.random());
        toggleEditState();

    }
    
    const toggleLiked = async () => {

        await likeComment(token, comment._id);
        props.updatePost(Math.random());
        setLiked(() => !liked);

    };
    
    const cleanDate = new Date(comment.timestamp)
        .toLocaleString("en-gb")
        .slice(0, -3)
        .replaceAll(",", "");

    return (
        <div className="post-comment">
            <div className="post-comment-header">
                <Link className="post-comment-header-name" to={
                    comment.isYours ? "/profile" : `/profile/${comment.user}`
                }>
                    {comment.user}
                </Link>
                <p>{cleanDate}</p>
            </div>
            <div className="post-comment-body">
                { editState ? (
                    <TextareaAutosize
                        value={commentMessage}
                        onChange={e => setCommentMessage(e.target.value)}
                    />
                ) : (
                    <p>{commentMessage}</p>
                )}
            </div>
            <div className="post-comment-actions">
                <div>
                    <LikeCommentButton
                        liked={liked}
                        toggleLiked={toggleLiked}
                        beanNumber={comment.beans.length}
                        editState={editState}
                    />
                </div>
                { isYours && (
                    <div>
                        { editState ? (
                            <>
                                <ConfirmEditCommentButton
                                    handleEdit={handleEdit}
                                />
                                <CancelEditCommentButton
                                    cancelEdit={cancelEdit}
                                />
                            </>
                        ) : (
                            <EditCommentButton
                                toggleEditState={toggleEditState}
                            />
                        )}

                        <DeleteCommentButton
                            isYours={comment.isYours}
                            comment_id={comment._id}
                            DeleteComment={deleteComment}
                            UpdatePost={props.updatePost}
                            editState={editState}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Comment;


