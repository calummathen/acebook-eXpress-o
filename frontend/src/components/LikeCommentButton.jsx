import { PiCoffeeBeanFill, PiCoffeeBeanBold } from "react-icons/pi";

const LikeCommentButton = (props) => {
    return (
        <button
            onClick={() => props.toggleLiked()}
            disabled={props.editState}
            className={`post-comment-like-button ${props.liked && "post-comment-like-button-liked"}`}
        >
            
            { props.liked ? (
                <PiCoffeeBeanFill />
            ) : (
                <PiCoffeeBeanBold />
            )}

            <p>{props.beanNumber} {props.beanNumber == 1 ? "Bean" : "Beans"}</p>

        </button>
    )
}

export default LikeCommentButton;