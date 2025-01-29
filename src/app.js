const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

//Creating a post /signup
app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Pseudo",
    lastName: "Bish",
    emailId: "pseudo@bish.com",
    password: "pseudo123",
  });
  try {
    await user.save();
    res.send("User Added sucessfully");
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Db connection made");
    app.listen(6969, () => {
      console.log("Server is up and running!");
    });
  })
  .catch((err) => {
    console.error("Db connection not made");
  });
