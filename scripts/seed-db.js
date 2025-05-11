import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI;

// Define the product schema for seeding
const ProductSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    hoverImage: { type: String, required: true },
    colors: [
      {
        name: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    sizes: [String],
    sizeAndFit: [String],
    inStock: { type: Boolean, default: true },
    mainTags: [String],
    additionalImages: [String],
    imageColorMap: { type: mongoose.Schema.Types.Mixed },
    badge: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create the model
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

// Function to extract products from the data file
async function extractProducts() {
  try {
    // Read the products.js file
    const filePath = path.join(path.resolve(), "app/data/products.js");
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Extract the products array using regex
    const productsMatch = fileContent.match(/export const products = \[([\s\S]*)\]/);

    if (!productsMatch || !productsMatch[1]) {
      throw new Error("Could not extract products from file");
    }

    // Create a temporary file with just the products array
    const tempFilePath = path.join(path.resolve(), "temp-products.js");
    fs.writeFileSync(tempFilePath, `export default [${productsMatch[1]}];`);

    // Import the products
    const { default: products } = await import(`file://${tempFilePath}`);

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);

    return products;
  } catch (error) {
    console.error("Error extracting products:", error);
    return [];
  }
}

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Extract products from the data file
    const products = await extractProducts();

    if (!products.length) {
      throw new Error("No products found to seed");
    }

    console.log(`Found ${products.length} products to seed`);

    // Update existing products or insert new ones
    for (const product of products) {
      await Product.updateOne(
        { id: product.id },        // Match by ID
        { $set: product },         // Update with product data
        { upsert: true }           // Insert if not found
      );
    }

    console.log(`Successfully seeded ${products.length} products`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
