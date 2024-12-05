const FilterPostsButton = ({toggleFriendsPosts, viewFriendsPosts}) =>{
    return (
      <button onClick={toggleFriendsPosts} className={viewFriendsPosts && "post-toggles-active"}>Friends Posts</button>
  )

};

export default FilterPostsButton;