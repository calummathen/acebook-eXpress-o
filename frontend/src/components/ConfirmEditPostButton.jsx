import { TbPencilCheck } from "react-icons/tb";

const ConfirmEditPostButton = ({handleEdit}) =>{
    return (
        <button onClick={handleEdit}><TbPencilCheck /></button>
    )
    
};

export default ConfirmEditPostButton;