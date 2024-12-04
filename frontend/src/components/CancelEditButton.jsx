const CancelEditButton = ({toggleEditState, setUpdatePost}) => {
  return (
    <button onClick={()=>{
      toggleEditState()
      setUpdatePost(Math.random())
    }

    }>Cancel Edit</button>
  )
}

export default CancelEditButton;