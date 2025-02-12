const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://root:root@jod.v4vkw6g.mongodb.net/?retryWrites=true&w=majority&appName=JOD"
  );
};

module.exports = connectDB;

//pseudobish
//mongodb+srv://pseudobish:pseudobish@pseudobishmongodbfordev.ypjhp.mongodb.net/

//It dont work anymore: "mongodb+srv://pseudobish:WzXLDyuaRin6Jsqo@pseudobishfirstcluster.c8ftr.mongodb.net/devTinder"

//Dojacat@069
//Kanyewest@69
//Pseudobish@069
