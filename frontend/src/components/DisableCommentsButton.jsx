
const DisableCommentsButton = ({
  commentsEnabled,
  toggleCommentsEnabled,
  setUpdatePost,
}) => {

  return (
    <button
      onClick={() => {
        toggleCommentsEnabled();
        setUpdatePost(Math.random());
      }}
    >
      {commentsEnabled ? "Disable Comments" :  "Enable Comments"}
    </button>
  );
};

export default DisableCommentsButton;
