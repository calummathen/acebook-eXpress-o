require("../mongodb_helper");
const User = require("../../models/user");

describe("User model", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("has an email address", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
    });
    expect(user.email).toEqual("someone@example.com");
  });

  it("has a password", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
    });
    expect(user.password).toEqual("password");
  });

  it("can list all users", async () => {
    const users = await User.find();
    expect(users).toEqual([]);
  });

  it("can save a user", async () => {
    const user = new User({
      name: "Test User",
      username: "user-test",
      birthday: "2000-11-25",
      email: "someone@example.com",
      password: "password",
    });

    await user.save();
    const users = await User.find();

    expect(users[0].name).toEqual("Test User");
    expect(users[0].username).toEqual("user-test");
    expect(users[0].birthday).toEqual(new Date("2000-11-25"));
    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password");
  });

  it("can save a username as lowercase to ensure unique usernames", async () => {
    const user = new User({
      name: "Test User",
      username: "user-Test",
      birthday: "2000-11-25",
      email: "someone@example.com",
      password: "password",
    });

    await user.save();
    const users = await User.find();

    expect(users[0].name).toEqual("Test User");
    expect(users[0].username).toEqual("user-test");
    expect(users[0].birthday).toEqual(new Date("2000-11-25"));
    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password");
  });

  it("can save an email as lowercase to ensure unique emails", async () => {
    const user = new User({
      name: "Test User",
      username: "user-test",
      birthday: "2000-11-25",
      email: "someOne@example.com",
      password: "password",
    });

    await user.save();
    const users = await User.find();

    expect(users[0].name).toEqual("Test User");
    expect(users[0].username).toEqual("user-test");
    expect(users[0].birthday).toEqual(new Date("2000-11-25"));
    expect(users[0].email).toEqual("someone@example.com");
    expect(users[0].password).toEqual("password");
  });
});
