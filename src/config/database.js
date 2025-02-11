const mongoose = require("mongoose");
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://pseudobish:pseudobish@devtinderbackup2.ypjhp.mongodb.net/devTinder"
  );
};

module.exports = connectDB;

//pseudobish
//mongodb+srv://pseudobish:pseudobish@pseudobishmongodbfordev.ypjhp.mongodb.net/

//It dont work anymore: "mongodb+srv://pseudobish:WzXLDyuaRin6Jsqo@pseudobishfirstcluster.c8ftr.mongodb.net/devTinder"

//Dojacat@069
//Kanyewest@69
//Pseudobish@069
