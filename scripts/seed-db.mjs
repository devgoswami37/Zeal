import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { products } from '../app/data/products.js';
import dotenv from 'dotenv';
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB connection string
const MONGODB_URI =process.env.MONGODB_URI;

// Define the product schema for seeding
const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  hoverImage: { type: String, required: true },
  colors: [{
    name: { type: String, required: true },
    image: { type: String, required: true },
  }],
  sizes: [String],
  sizeAndFit: [String],
  inStock: { type: Boolean, default: true },
  mainTags: [String],
  additionalImages: [String],
  imageColorMap: { type: mongoose.Schema.Types.Mixed },
  badge: { type: String },
}, {
  timestamps: true
});

// Create the model
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// Function to seed the database
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    if (!products || !products.length) {
      throw new Error('No products found to seed');
    }
    
    console.log(`Found ${products.length} products to seed`);
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Insert the products
    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products`);
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
