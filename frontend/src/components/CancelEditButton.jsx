import { TbPencilOff } from "react-icons/tb";

const CancelEditButton = ({cancelEdit}) =>{
    return (
        <button onClick={cancelEdit}><TbPencilOff /></button>
    )
    
};

export default CancelEditButton;