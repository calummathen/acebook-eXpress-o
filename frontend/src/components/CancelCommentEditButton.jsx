import { TbPencilOff } from "react-icons/tb";

const CancelEditCommentButton = ({cancelEdit}) =>{
    return (
        <button onClick={cancelEdit}><TbPencilOff /></button>
    )
    
};

export default CancelEditCommentButton;