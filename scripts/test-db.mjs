import dbConnect from "../lib/mongodb";

async function testConnection() {
  try {
    console.log("Testing database connection...");
    await dbConnect();
    console.log("Database connection test successful!");
  } catch (error) {
    console.error("Database connection test failed:", error);
  }
}

testConnection();