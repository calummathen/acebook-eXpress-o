const request = require("supertest");

const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST, when email and password are provided", () => {
    test("the response code is 201", async () => {
      const response = await request(app)
        .post("/users")
        .send({
          name: "Poppy",
          username: "poppy",
          birthday: "2000-11-25",
          email: "poppy@email.com",
          password: "1234"
        });

      expect(response.statusCode).toBe(201);
    });

    test("a user is created", async () => {
      await request(app)
        .post("/users")
        .send({
          name: "Scarconstt",
          username: "scarconstt",
          birthday: "2000-11-25",
          email: "scarconstt@email.com",
          password: "1234"
        });

      const users = await User.find();
      const newUser = users[users.length - 1];
      expect(newUser.name).toEqual("Scarconstt");
      expect(newUser.username).toEqual("scarconstt");
      expect(newUser.birthday).toEqual(new Date("2000-11-25"));
      expect(newUser.email).toEqual("scarconstt@email.com");
    });
  });

  describe("POST, when password is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "skye@email.com" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ email: "skye@email.com" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is missing", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ password: "1234" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ password: "1234" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when username is not unique because of case check", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ username: "javajunkie" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ username: "javajunkie" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });

  describe("POST, when email is not unique because of case check", () => {
    test("response code is 400", async () => {
      const response = await request(app)
        .post("/users")
        .send({ email: "javajunkie@100.com" });

      expect(response.statusCode).toBe(400);
    });

    test("does not create a user", async () => {
      await request(app).post("/users").send({ username: "javajunkie" });

      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });
});
