import { TbPencil } from "react-icons/tb";

const EditPostButton = ({toggleEditState}) =>{
    return (
        <button onClick={toggleEditState}><TbPencil /></button>
    )
    
};

export default EditPostButton;