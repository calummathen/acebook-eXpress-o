import { BiRepost } from "react-icons/bi";

const RepostButton = (props) => {
    return (
        
        <button onClick={props.onRepost} disabled={props.editState || props.reposted}>
            <BiRepost />

            {props.reposted ? (
                "Reposted"
            ) : (
                "Repost"
            )}
        </button>
    );
};

export default RepostButton;
