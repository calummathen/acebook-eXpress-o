import { PiCoffeeBeanFill, PiCoffeeBeanBold } from "react-icons/pi";

const LikeCommentButton = (props) => {
    return (
        <div>
            <button onClick={() => props.toggleLiked()}>
                
                { props.isLiked ? (
                    <PiCoffeeBeanFill />
                ) : (
                    <PiCoffeeBeanBold />
                )}

                <p>{props.beanNumber} Beans</p>
            </button>
        </div>
    )
}

export default LikeCommentButton;