import { MdOutlineComment, MdOutlineCommentsDisabled } from "react-icons/md";

const DisableCommentsButton = (props) => {
    
    return (
        <button onClick={() => {
            props.toggleCommentsEnabled();
            props.setUpdatePost(Math.random());
        }} disabled={props.editState}>
        
            { props.commentsEnabled ? (
                <MdOutlineComment />
            ) :  (
                <MdOutlineCommentsDisabled />
            )}
        </button>
    );
};

export default DisableCommentsButton;
