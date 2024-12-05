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
        username: "javajunkie",
        name: "Charles",
        email: "javajunkie@coffee.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("2000-01-01"),
        profileImage: "/images/Charles1.jpg",
      },
      {
        username: "beanblogger",
        name: "Bobbi",
        email: "beanblogger@coffee.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("1991-03-18"),
        profileImage:"/images/Bobbi.jpg",
      },
      {
        username: "lattelover",
        name: "Leticia",
        email: "lattelover@latte.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("1989-09-25"),
        profileImage:"/images/Leticia.jpg",
      },
      {
        username: "coldbrewfanatic",
        name: "Chris",
        email: "coldbrewfanatic@coffee.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("1993-12-12"),
        profileImage:"/images/Chris.jpg",
      },
      {
        username: "capuccinoking",
        name: "Carl",
        email: "capuccinoking@coffee.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("1987-07-07"),
        profileImage:"/images/Carl.jpg",
      },
      {
        username: "dripking",
        name: "Daniel",
        email: "dripking@javaworld.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("1997-02-16"),
        profileImage:"/images/Daniel.jpg",
      },
      {
        username: "darkroastdevotee",
        name: "Derek",
        email: "darkroastdevotee@coffeecrew.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("2004-12-16"),
        profileImage:"/images/Derek.jpg",
      },
      {
        username: "cafecraver",
        name: "Chloe",
        email: "cafecraver@latteplace.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("2000-03-27"),
        profileImage:"/images/Chloe.jpg"
      },
      {
        username: "sipandsavor",
        name: "Sophie",
        email: "sipandsavor@latteplace.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("1995-10-03"),
        profileImage: "/images/Sophie.jpg",
      },
      {
        username: "scarpenter",
        name: "Sabrina",
        email: "scarpenter@espresso.com",
        password:
          "$2b$10$EC7tDwsuW.CTjF5EpPCZ4e1KNyW/ZOoI3uM.ygp3aNK8uaz5MgtZG",
        birthday: new Date("1999-05-11"),
        profileImage: "/images/Sabrina_Carpenter.png",
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
        user: "javajunkie",
        message:
          "Just enjoyed a cup of the most amazing cold brew coffee! ☕️ The rich, smooth flavor with a hint of chocolate notes made my morning. Who else can't start their day without their favorite brew?",
        beans: ["BeanBlogger"],
        timestamp: new Date("2024-11-26 18:17"),
      },
      {
        user: "scarpenter",
        message:
          "I'm working late, 'cause I'm a coder. #Thatsthatmeespresso",
        beans: ["BeanBlogger"],
        timestamp: new Date("2024-11-26 00:01"),
      },
      {
        user: "beanblogger",
        message:
          "Just discovered a cozy little café tucked away on Elm Street! ☕️ Their hazelnut cappuccino is the perfect blend of rich and smooth—absolutely made my morning. Can't wait to become a regular there! Has anyone else been? #CoffeeAdventures #CafeHopping",
        beans: ["JavaJunkie"],
        timestamp: new Date("2024-10-10 08:14"),
      },
      {
        user: "beanblogger",
        message:
          "Just tried a new coffee blend this morning, and it's absolutely amazing! The rich aroma filled my kitchen, and the first sip was like a warm hug in a mug. Can't wait to share it with friends. ☕️😍 #CoffeeLove #MorningPerk #NewBlend",
        beans: [],
        timestamp: new Date("2023-10-13 07:27"),
      },
      {
        user: "javajunkie",
        message:
          "Just enjoyed the most incredible cup of Ethiopian roast this morning! ☕️ The fruity notes and smooth finish were absolutely delightful. Anyone else have a favorite coffee origin they swear by?",
        beans: ["LatteLover", "BeanBlogger"],
        timestamp: new Date("2024-08-01 15:33"),
      },
      {
        user: "lattelover",
        message:
          "Just treated myself to a caramel latte from the new café down the street! ☕️😍 The perfect blend of sweet and creamy. Has anyone else discovered a new favorite coffee spot lately?",
        beans: ["JavaJunkie"],
        timestamp: new Date("2022-06-07 11:12"),
      },
      {
        user: "sipandsavor",
        message:
          "Tried a new coffee blend today: Ethiopian Yirgacheffe. The floral aroma and bright citrus notes are incredible! 🌼🍋 What's your go-to single-origin coffee?",
        beans: ["cafecraver", "coldbrewfanatic"],
        timestamp: new Date("2023-11-29 10:15"),
      },
      {
        user: "cafecraver",
        message:
          "Nothing beats the comfort of a cappuccino on a rainy day. ☔️ Frothy, creamy, and perfect with a good book. What's your rainy-day coffee ritual?",
        beans: ["sipandsavor", "darkroastdevotee"],
        timestamp: new Date("2023-11-29 14:30"),
      },
      {
        user: "darkroastdevotee",
        message:
          "Bold, smoky, and full-bodied — that's how I like my coffee! Tried French Roast today, and I'm hooked. Who's into the dark side? ☕️",
        beans: ["dripking", "capuccinoking"],
        timestamp: new Date("2023-11-29 09:45"),
      },
      {
        user: "dripking",
        message:
          "Drip coffee is underrated! It's simple, but when done right, it can bring out the cleanest flavors. Tried it with a Kenyan roast today — fantastic! 🌍",
        beans: ["sipandsavor", "coldbrewfanatic"],
        timestamp: new Date("2023-11-29 08:20"),
      },
      {
        user: "capuccinoking",
        message:
          "The foam art on my cappuccino today was a little heart. ❤️ It's the little things that make coffee moments special. Do you take time to enjoy the artistry?",
        beans: ["darkroastdevotee", "dripking"],
        timestamp: new Date("2023-11-29 11:10"),
      },
      {
        user: "coldbrewfanatic",
        message:
          "Cold brew with a splash of vanilla almond milk = perfection! 🥶☕️ Smooth, sweet, and refreshing. What's your favorite cold coffee combo?",
        beans: ["sipandsavor", "cafecraver"],
        timestamp: new Date("2023-11-29 13:05"),
      },
    ];
    
    for (const postData of posts) {
      const post = new Post(postData);
      await post.save();
      console.log(`Post by ${post.user} created.`);
    }

    const friends = [
      {
        sender: "javajunkie",
        receiver: "lattelover",
        approved: true,
        timestamp: new Date("2024-11-25 10:44"),
      },
      {
        sender: "beanblogger",
        receiver: "javajunkie",
      },
      {
        sender: "sipandsavor",
        receiver: "cafecraver",
        approved: true,
        timestamp: new Date("2023-09-25 09:15"),
      },
      {
        sender: "cafecraver",
        receiver: "darkroastdevotee",
      },
      {
        sender: "darkroastdevotee",
        receiver: "dripking",
        approved: true,
        timestamp: new Date("2023-01-27 16:45"),
      },
      {
        sender: "dripking",
        receiver: "coldbrewfanatic",
        approved: true,
        timestamp: new Date("2024-01-01 12:30"),
      },
      {
        sender: "capuccinoking",
        receiver: "sipandsavor",
      },
      {
        sender: "coldbrewfanatic",
        receiver: "javajunkie",
        approved: true,
        timestamp: new Date("2024-02-14 14:00"),
      },
      {
        sender: "beanblogger",
        receiver: "capuccinoking",
      },
      {
        sender: "lattelover",
        receiver: "darkroastdevotee",
        approved: true,
        timestamp: new Date("2024-11-28 18:20"),
      },
      {
        sender: "beanblogger",
        receiver: "scarpenter",
        approved: true,
        timestamp: new Date("2024-11-29 18:20"),
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
