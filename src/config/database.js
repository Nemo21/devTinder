const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = connectDB;

//pseudobish
//mongodb+srv://pseudobish:pseudobish@pseudobishmongodbfordev.ypjhp.mongodb.net/

//It dont work anymore: "mongodb+srv://pseudobish:WzXLDyuaRin6Jsqo@pseudobishfirstcluster.c8ftr.mongodb.net/devTinder"

//Dojacat@069
//Kanyewest@69
//Pseudobish@069
