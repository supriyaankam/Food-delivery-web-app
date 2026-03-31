import mongoose from "mongoose";
import Food from "./models/Food.js"; // make sure path is correct
import dotenv from "dotenv";

dotenv.config(); // optional if you use .env for MongoDB URI

const foods = [
  { name: "Chicken Biryani", price: 200, image: "/images/chickenbiryani.jpg", category: "Biryani" },
  { name: "Mutton Biryani", price: 250, image: "/images/muttonbiryani.jpg", category: "Biryani" },
  { name: "Veg Biryani", price: 150, image: "/images/vegbiryani.jpg", category: "Biryani" },
  { name: "Paneer Biryani", price: 170, image: "/images/paneerbiryani.jpg", category: "Biryani" },
  { name: "Mushroom Biryani", price: 180, image: "/images/mushroombiryani.jpg", category: "Biryani" },
  { name: "Veg Fried Rice", price: 120, image: "/images/vegfriedrice.jpg", category: "Fried Rice" },
  { name: "Chicken Fried Rice", price: 150, image: "/images/chickenfriedrice.jpg", category: "Fried Rice" },
  { name: "Corn Rice", price: 90, image: "/images/cornrice.jpg", category: "Fried Rice" },
  { name: "Noodles", price: 100, image: "/images/noodles.jpg", category: "Noodles" },
  { name: "Garlic Noodles", price: 100, image: "/images/garlicnoodles.jpg.jpg", category: "Noodles" },
  { name: "Chicken Lollipop", price: 120, image: "/images/chickenlollipop.jpg", category: "Starters" },
  { name: "Chicken Pakodi", price: 100, image: "/images/chickenpakodi.jpg", category: "Starters" },
  { name: "Grill Chicken", price: 250, image: "/images/grillchicken.jpg", category: "Starters" },
  { name: "Manchuria", price: 50, image: "/images/manchuria.jpg", category: "Starters"},
  { name: "Burger", price: 50, image: "/images/burger.jpg", category: "Snacks" },
  { name: "Pizza", price: 200, image: "/images/pizza.jpg", category: "Snacks" },
  { name: "Pasta", price: 150, image: "/images/pasta.jpg", category: "Snacks" },
  { name: "Samosa", price: 20, image: "/images/samosa.jpg", category: "Snacks"},
  { name: "Pav Bhaji", price: 80, image: "/images/pavbhaji.jpg", category: "Snacks"},
  { name: "Tea", price: 20, image: "/images/tea.jpg", category: "Drinks" },
  { name: "Coffee", price: 40, image: "/images/coffee.jpg", category: "Drinks" },
  { name: "CocaCola", price: 30, image: "/images/cocacola.jpg", category: "Drinks" },
  { name: "Sprite", price: 30, image: "/images/sprite.jpg", category: "Drinks" },
  { name: "Thums Up", price: 30, image: "/images/thumsup.jpg", category: "Drinks" },
  { name: "Vannilla", price: 40, image: "/images/vannilaicecream.jpg", category: "IceCreams"},
  { name: "Choclate", price: 50, image: "/images/choclateicecream.jpg", category: "IceCreams"},
  { name: "Butterscotch", price: 60, image: "/images/butterscotchicecream.jpg", category: "Icecreams"},
  { name: "Black Forest", price: 80, image: "/images/blackforest.jpg", category: "Icecreams"},
  { name: "Garlic Noodles", price: 120, image: "/images/garlicnoodles.jpg", category: "Noodles"},
];

mongoose.connect("mongodb://127.0.0.1:27017/foodapp")
  .then(async () => {
    console.log("MongoDB connected");

    // Optional: Clear existing foods first
    await Food.deleteMany({});
    console.log("Existing foods cleared");

    // Insert foods
    await Food.insertMany(foods);
    console.log("Foods seeded successfully");

    process.exit();
  })
  .catch(err => console.log(err));
