import { PiCoffeeBeanFill, PiCoffeeBeanBold } from "react-icons/pi";

const LikePostButton = (props) => {
    return (
        <button onClick={() => props.toggleLiked()} disabled={props.editState} className={`post-like-button ${props.liked && "post-like-button-liked"}`}>
            
            { props.liked ? (
                <PiCoffeeBeanFill />
            ) : (
                <PiCoffeeBeanBold />
            )}

            <p>{props.beanNumber} {props.beanNumber == 1 ? "Bean" : "Beans"}</p>

        </button>
    )
}

export default LikePostButton;