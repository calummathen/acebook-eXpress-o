const request = require("supertest");
const JWT = require("jsonwebtoken");

const app = require("../../app");
const User = require("../../models/user");
const Friend = require("../../models/friend");

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
describe("/friends", () => {
  beforeAll(async () => {
    const user = new User({
      name: "Test User",
      username: "friend-test",
      birthday: "2000-11-25",
      email: "friend-test@test.com",
      password: "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
    });
    await user.save();
    await Friend.deleteMany({});
    token = createToken(user.id, user.username);
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Friend.deleteMany({});
  });

  describe("GET, when token is present", () => {
    test("the response code is 200", async () => {
        const friend1 = new Friend({ sender: "friend-test", receiver: "friend-test-other" });
        const friend2 = new Friend({ sender: "friend-test-other", receiver: "friend-test-other-other" })
        await friend1.save();
        await friend2.save();

        const response = await request(app)
        .get("/friends")
        .set("Authorization", `Bearer ${token}`);

        expect(response.status).toEqual(200);
    });

    test("returns every friendship that involves the user", async () => {
        const friend1 = new Friend({ sender: "friend-test", receiver: "friend-test-other", approved: true });
        const friend2 = new Friend({ sender: "friend-test-other", receiver: "friend-test-other-other", approved: true })
        await friend1.save();
        await friend2.save();

        const response = await request(app)
        .get("/friends")
        .set("Authorization", `Bearer ${token}`);

        const friends = response.body.friends

        expect(friends.length).toEqual(1);
        expect(friends).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                sender: "friend-test",
                receiver: "friend-test-other"
              }),
            ])
        );
    });

    test("returns a new token", async () => {
        const friend1 = new Friend({ sender: "friend-test", receiver: "friend-test-other", approved: true });
        const friend2 = new Friend({ sender: "friend-test-other", receiver: "friend-test-other-other", approved: true })
        await friend1.save();
        await friend2.save();

        const response = await request(app)
        .get("/friends")
        .set("Authorization", `Bearer ${token}`);

        const newToken = response.body.token;
        const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

        expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });
  
  describe("GET, when token is missing", () => {
    test("the response code is 401", async () => {
        const friend1 = new Friend({ sender: "friend-test", receiver: "friend-test-other" });
        const friend2 = new Friend({ sender: "friend-test-other", receiver: "friend-test-other-other" })
        await friend1.save();
        await friend2.save();

        const response = await request(app).get("/friends");
        expect(response.status).toEqual(401);
    });

    test("returns no friendships", async () => {
        const friend1 = new Friend({ sender: "friend-test", receiver: "friend-test-other", approved: true });
        const friend2 = new Friend({ sender: "friend-test-other", receiver: "friend-test-other-other", approved: true })
        await friend1.save();
        await friend2.save();

        const response = await request(app).get("/friends")

        expect(response.body.friends).toEqual(undefined);
    });

    test("does not return a new token", async () => {
        const friend1 = new Friend({ sender: "friend-test", receiver: "friend-test-other", approved: true });
        const friend2 = new Friend({ sender: "friend-test-other", receiver: "friend-test-other-other", approved: true })
        await friend1.save();
        await friend2.save();

        const response = await request(app).get("/friends")

        expect(response.body.token).toEqual(undefined);
    });
  });

  describe("POST, when token is present", () => {
    test("the response code is 201", async () => {

        const response = await request(app)
        .post("/friends/request")
        .set("Authorization", `Bearer ${token}`)
        .send({ sender: "friend-test", receiver: "friend-test-other", approved: true });

        expect(response.status).toEqual(201);
    });

    test("creates a new friendship", async () => {

        await request(app)
            .post("/friends/request")
            .set("Authorization", `Bearer ${token}`)
            .send({ sender: "friend-test", receiver: "friend-test-other" });

        const friends = await Friend.find();

        expect(friends.length).toEqual(1);
        expect(friends).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                sender: "friend-test",
                receiver: "friend-test-other"
              }),
            ])
        );
    });

    test("returns a new token", async () => {

        const response = await request(app)
        .post("/friends/request")
        .set("Authorization", `Bearer ${token}`)
        .send({ sender: "friend-test", receiver: "friend-test-other" });

        const newToken = response.body.token;
        const newTokenDecoded = JWT.decode(newToken, process.env.JWT_SECRET);
        const oldTokenDecoded = JWT.decode(token, process.env.JWT_SECRET);

        expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });
  
  describe("POST, when token is missing", () => {
    test("the response code is 401", async () => {

        const response = await request(app)
        .post("/friends/request")
        .send({ sender: "friend-test", receiver: "friend-test-other" });

        expect(response.status).toEqual(401);
    });

    test("returns no friendships", async () => {
        
        const response = await request(app)
        .post("/friends/request")
        .send({ sender: "friend-test", receiver: "friend-test-other" });

        expect(response.body.friends).toEqual(undefined);
    });

    test("does not return a new token", async () => {

        const response = await request(app)
        .post("/friends/request")
        .send({ sender: "friend-test", receiver: "friend-test-other" });

        expect(response.body.token).toEqual(undefined);
    });
  });
});