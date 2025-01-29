const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pseudobish:WzXLDyuaRin6Jsqo@pseudobishfirstcluster.c8ftr.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
