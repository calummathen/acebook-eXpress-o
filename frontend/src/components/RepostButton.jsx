const RepostButton = ({ reposted, onRepost }) => {
  return (
    <div>
      <button onClick={onRepost}>
        {reposted ? "🔁 Reposted" : "🔄 Repost"} {/* Toggle button text */}
      </button>
    </div>
  );
};

export default RepostButton;
