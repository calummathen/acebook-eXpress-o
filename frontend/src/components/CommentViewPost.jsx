import { MdOutlineComment } from "react-icons/md";

const ConmmentViewPostButton = (props) => {
    console.log(props.comments)
    return (
        <button onClick={props.toggleComments} disabled={
            props.editState ||
            (props.comments.length == 0 && !props.commentsEnabled)
        }>
            <MdOutlineComment />

            <p>{props.comments.length} {props.comments.length == 1 ? "Comment" : "Comments"}</p>
        </button>
    )
};

export default ConmmentViewPostButton;