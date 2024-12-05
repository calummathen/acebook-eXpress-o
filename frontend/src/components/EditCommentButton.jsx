import { TbPencil } from "react-icons/tb";

const EditCommentButton = ({toggleEditState}) =>{
    return (
        <button onClick={toggleEditState}><TbPencil /></button>
    )
    
};

export default EditCommentButton;