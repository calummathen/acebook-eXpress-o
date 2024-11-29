require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const Friend = require("../models/friend");
const { connectToDatabase } = require("./db");

async function seedData() {
  await connectToDatabase();
  await mongoose.connection.db.dropDatabase();
  console.log("Cleared existing data.");

  try {
    // Seed Users
    const users = [
      {
        username: "JavaJunkie",
        name: "Charles",
        email: "javajunkie@coffee.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("2000-01-01"),
        location: "Sttutgart",
        work_place: "BMW",
        telephone_number:"07856456765"
      },
      {
        username: "BeanBlogger",
        name: "Bob",
        email: "beanblogger@coffee.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("1991-03-18"),
        location: "London",
        work_place: "Trainline",
        telephone_number:"07856456765"
      },
      {
        username: "LatteLover",
        name: "Leticia",
        email: "lattelover@latte.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("1989-09-25"),
        location: "London",
        work_place: "Makers",
        telephone_number:"078564569875"
      },
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`User ${user.username} created.`);
    }

    // Seed Posts
    const posts = [
      {
        user: "JavaJunkie",
        message:
          "Just enjoyed a cup of the most amazing cold brew coffee! ☕️ The rich, smooth flavor with a hint of chocolate notes made my morning. Who else can't start their day without their favorite brew?",
        beans: ["BeanBlogger"],
        timestamp: new Date("2023-11-26 18:17"),
      },
      {
        user: "BeanBlogger",
        message:
          "Just discovered a cozy little café tucked away on Elm Street! ☕️ Their hazelnut cappuccino is the perfect blend of rich and smooth—absolutely made my morning. Can't wait to become a regular there! Has anyone else been? #CoffeeAdventures #CafeHopping",
        beans: ["JavaJunkie"],
        timestamp: new Date("2024-10-10 08:14"),
      },
      {
        user: "BeanBlogger",
        message:
          "Just tried a new coffee blend this morning, and it's absolutely amazing! The rich aroma filled my kitchen, and the first sip was like a warm hug in a mug. Can't wait to share it with friends. ☕️😍 #CoffeeLove #MorningPerk #NewBlend",
        beans: [],
        timestamp: new Date("2023-10-13 07:27"),
      },
      {
        user: "JavaJunkie",
        message:
          "Just enjoyed the most incredible cup of Ethiopian roast this morning! ☕️ The fruity notes and smooth finish were absolutely delightful. Anyone else have a favorite coffee origin they swear by?",
        beans: ["LatteLover", "BeanBlogger"],
        timestamp: new Date("2024-08-01 15:33"),
      },
      {
        user: "LatteLover",
        message:
          "Just treated myself to a caramel latte from the new café down the street! ☕️😍 The perfect blend of sweet and creamy. Has anyone else discovered a new favorite coffee spot lately?",
        beans: ["JavaJunkie"],
        timestamp: new Date("2022-06-07 11:12"),
      },
    ];

    for (const postData of posts) {
      const post = new Post(postData);
      await post.save();
      console.log(`Post by ${post.user} created.`);
    }

    const friends = [
      {
        sender: "JavaJunkie",
        receiver: "LatteLover",
        approved: true,
        timestamp: new Date("2024-11-25 10:44"),
      },
      {
        sender: "BeanBlogger",
        receiver: "JavaJunkie",
      },
    ];

    for (const friendData of friends) {
      const friend = new Friend(friendData);
      await friend.save();
      console.log(
        `Friendship between ${friend.sender} and ${friend.receiver} created.`
      );
    }

    console.log("Seeding completed successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    mongoose.disconnect();
    console.log("Disconnected from database.");
  }
}

seedData().catch((err) => {
  console.error("Error running seed script:", err);
});
