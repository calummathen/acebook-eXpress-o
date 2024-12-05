import { TbPencilOff } from "react-icons/tb";

const EditPostButton = ({cancelEdit}) =>{
    return (
        <button onClick={cancelEdit}><TbPencilOff /></button>
    )
    
};

export default EditPostButton;