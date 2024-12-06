import { useState } from "react";
import TextareaAutosize from 'react-textarea-autosize';

import { CreateComment } from "../services/comments";

import { MdOutlineAddComment } from "react-icons/md";

const AddCommentToPost = ({ UpdatePost, postId }) => {

    const token = localStorage.getItem("token");
    
    const [commentMessage, setCommentMessage] = useState("");
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        const CreatedComment = await CreateComment(token, commentMessage, postId)
        UpdatePost(CreatedComment)
        setCommentMessage("");
    }

    return (
        <form onSubmit={handleSubmit} className="post-add-comment-form">
            <TextareaAutosize
                value={commentMessage}
                onChange={e => setCommentMessage(e.target.value)}
            />
            <button type="submit" disabled={commentMessage == ""}><MdOutlineAddComment /></button>
        </form>
    )
};

export default AddCommentToPost;
