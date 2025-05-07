const mongoose = require("mongoose");
import dotenv from 'dotenv';
dotenv.config();

// Define the Review Schema
const ReviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: { type: String, required: true },
    email: { type: String, required: true },
    photos: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create the Review model
const Review = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

// Sample reviews data
const reviews = [
  {
    productId: "1",
    title: "Amazing Product!",
    content: "This product exceeded my expectations. The quality is top-notch, and it works perfectly.",
    rating: 5,
    author: "John Doe",
    email: "john.doe@example.com",
    photos: [
      "https://betty-theme.myshopify.com/cdn/shop/products/fablou_city_malibu.jpg?v=1601478188",
      "https://showcase-theme-mila.myshopify.com/cdn/shop/products/elite-black-seperates-bottom-elite-black-regular-bikini-pant-28340247232621.jpg?v=1651825938",
    ],
    date: new Date(),
  },
  {
    productId: "1",
    title: "Good Value for Money",
    content: "The product is worth the price. It performs well and looks great.",
    rating: 4,
    author: "Jane Smith",
    email: "jane.smith@example.com",
    photos: [],
    date: new Date(),
  },
  {
    productId: "1",
    title: "Decent but Could Be Better",
    content: "The product is okay, but I expected better durability. It’s good for light use.",
    rating: 3,
    author: "Alice Johnson",
    email: "alice.johnson@example.com",
    photos: ["photo3.jpg"],
    date: new Date(),
  },
  {
    productId: "1",
    title: "Not Satisfied",
    content: "The product didn’t meet my expectations. It feels cheap and doesn’t work as advertised.",
    rating: 2,
    author: "Bob Brown",
    email: "bob.brown@example.com",
    photos: [],
    date: new Date(),
  },
  {
    productId: "1",
    title: "Terrible Experience",
    content: "I regret buying this product. It broke within a week of use. Would not recommend.",
    rating: 1,
    author: "Charlie Davis",
    email: "charlie.davis@example.com",
    photos: ["photo4.jpg"],
    date: new Date(),
  },
];

// MongoDB Connection URI
const MONGODB_URI = process.env.MONGODB_URI; // Replace with your MongoDB URI

// Seed Reviews
const seedReviews = async () => {
  console.log("Starting the seeding process...");

  try {
    console.log("Attempting to connect to MongoDB...");
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    console.log("Clearing existing reviews...");
    // Clear existing reviews
    await Review.deleteMany({});
    console.log("Cleared existing reviews");

    console.log("Inserting reviews...");
    // Insert reviews
    await Review.insertMany(reviews);
    console.log("Seeded reviews successfully");

    console.log("Closing the MongoDB connection...");
    // Close the connection
    await mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error during the seeding process:", error);
    process.exit(1);
  }
};

// Run the seed function
seedReviews();
console.log("Seeding script executed.");