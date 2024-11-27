require("../mongodb_helper");

const Post = require("../../models/post");

describe("Post model", () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });

  it("has a message", () => {
    const post = new Post({ user: "post-test", message: "some message" });
    expect(post.user).toEqual("post-test");
    expect(post.message).toEqual("some message");
  });

  it("can list all posts", async () => {
    const posts = await Post.find();
    expect(posts).toEqual([]);
  });

  it("can save a post", async () => {
    const post = new Post({ user: "post-test", message: "some message" });

    await post.save();
    const posts = await Post.find();
    expect(posts[0].user).toEqual("post-test");
    expect(posts[0].message).toEqual("some message");
  });
});
