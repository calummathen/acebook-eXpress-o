const AllPostsButton = ({toggleAllPosts, viewFriendsPosts}) =>{
    return (
      <button onClick={toggleAllPosts} className={!viewFriendsPosts && "post-toggles-active"}>All Posts</button>
  )

};

export default AllPostsButton;