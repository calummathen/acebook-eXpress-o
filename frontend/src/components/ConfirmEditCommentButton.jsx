import { TbPencilCheck } from "react-icons/tb";

const ConfirmEditCommentButton = ({handleEdit}) =>{
    return (
        <button onClick={handleEdit}><TbPencilCheck /></button>
    )
    
};

export default ConfirmEditCommentButton;