const mongoose = require("mongoose");

async function connecttodb() {
  try {
    await mongoose.connect(
      `mongodb+srv://ankit123:${process.env.dbpwd}@cluster0.cqtqflo.mongodb.net/?retryWrites=true&w=majority&appName=uber`
    );
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Error connecting to MongoDB:", e); // Use console.error for errors
    throw e; // Re-throw the error to handle it in the calling code
  }
}

module.exports = { connecttodb };
