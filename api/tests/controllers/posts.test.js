const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

function createToken(userId, username) {
  return JWT.sign(
    {
      user_id: userId,
      username: username,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
}

let token;
describe("/posts", () => {
  beforeAll(async () => {
    const user = new User({
      name: "Test User",
      username: "post-test",
      birthday: "2000-11-25",
      email: "post-test@test.com",
      password: "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
    });
    await user.save();
    await Post.deleteMany({});
    token = createToken(user.id, user.username);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  describe("POST, when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!" });
      expect(response.status).toEqual(201);
    });

    test("creates a new post", async () => {
      await request(app)
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "Hello World!!" });

      const posts = await Post.find();
      expect(posts.length).toEqual(1);
      expect(posts[0].message).toEqual("Hello World!!");
      expect(posts[0].user).toEqual("post-test")
    });

    test("returns a new token", async () => {
      const testApp = request(app);
      const response = await testApp
        .post("/posts")
        .set("Authorization", `Bearer ${token}`)
        .send({ message: "hello world" });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.status).toEqual(401);
    });

    test("a post is not created", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      const posts = await Post.find();
      expect(posts.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/posts")
        .send({ message: "hello again world" });

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({ user: "post-test", message: "I love all my children equally" });
      const post2 = new Post({ user: "post-test", message: "I've never cared for GOB" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection", async () => {
      const post1 = new Post({ user: "post-test-1", message: "howdy!" });
      const post2 = new Post({ user: "post-test-2", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;

      expect(posts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: "post-test-1", message: "howdy!"
          }),
          expect.objectContaining({
            user: "post-test-2", message: "hola!"
          })
        ])
      );
    });

    test("returns a new token", async () => {
      const post1 = new Post({ user: "post-test", message: "First Post!" });
      const post2 = new Post({ user: "post-test", message: "Second Post!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET, when token is missing", () => {
    test("the response code is 401", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts");

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET user's posts, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({ user: "post-test", message: "I love all my children equally" });
      const post2 = new Post({ user: "post-test", message: "I've never cared for GOB" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts/mine")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection that is owned by the user", async () => {

      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts/mine")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;

      expect(posts.length).toEqual(1)
      expect(posts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: "post-test", message: "howdy!"
          }),
        ])
      );
    });

    test("returns a new token", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts/mine")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET user's posts, when token is missing", () => {
    test("the response code is 401", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts/mine");

      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts/mine");

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts/mine");

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("GET other user's posts, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({ user: "post-test", message: "I love all my children equally" });
      const post2 = new Post({ user: "post-test-other", message: "I've never cared for GOB" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts/post-test-other")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection that is owned by the other user", async () => {

      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts/post-test-other")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;

      expect(posts.length).toEqual(1)
      expect(posts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: "post-test-other", message: "hola!"
          }),
        ])
      );
    });

    test("returns a new token", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .get("/posts/post-test-other")
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("GET other user's posts, when token is missing", () => {
    test("the response code is 401", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts/post-test-other");

      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts/post-test-other");

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).get("/posts/post-test-other");

      expect(response.body.token).toEqual(undefined);
    });
  });

  describe("DELETE, when token is present", () => {
    test("the response code is 200", async () => {
      const post1 = new Post({ user: "post-test", message: "I love all my children equally" });
      const post2 = new Post({ user: "post-test", message: "I've never cared for GOB" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .delete(`/posts/${post1._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(200);
    });

    test("returns every post in the collection minus the deleted one", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      await request(app)
        .delete(`/posts/${post1._id}`)
        .set("Authorization", `Bearer ${token}`);
      
      const response = await request(app)
        .get("/posts")
        .set("Authorization", `Bearer ${token}`);

      const posts = response.body.posts;

      expect(posts.length).toEqual(1)
      expect(posts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            user: "post-test-other", message: "hola!"
          })
        ])
      );
    });

    test("returns a new token", async () => {
      const post1 = new Post({ user: "post-test", message: "First Post!" });
      const post2 = new Post({ user: "post-test-other", message: "Second Post!" });
      await post1.save();
      await post2.save();

      const response = await request(app)
        .delete(`/posts/${post1._id}`)
        .set("Authorization", `Bearer ${token}`);

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
      const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

      // iat stands for issued at
      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("DELETE, when token is missing", () => {
    test("the response code is 401", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).delete(`/posts/${post1._id}`);

      expect(response.status).toEqual(401);
    });

    test("returns no posts", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).delete(`/posts/${post1._id}`);

      expect(response.body.posts).toEqual(undefined);
    });

    test("does not return a new token", async () => {
      const post1 = new Post({ user: "post-test", message: "howdy!" });
      const post2 = new Post({ user: "post-test-other", message: "hola!" });
      await post1.save();
      await post2.save();

      const response = await request(app).delete(`/posts/${post1._id}`);

      expect(response.body.token).toEqual(undefined);
    });
  });
});
