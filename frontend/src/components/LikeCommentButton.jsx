const LikeCommentButton = (props) => {
  return (
      <div>
          <button onClick={() => props.toggleLiked()}>{(props.liked ? "💔Unbean" : "🤎Bean")}</button>
          <p>{props.beanNumber} Beans</p>
      </div>
  )
}

export default LikeCommentButton;