const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

//This coverts the send json to a javascript object and puts it in req.body
app.use(express.json());

//Creating a post /signup using dynamic data insted of static
app.post("/signup", async (req, res) => {
  console.log(req);
  console.log(req.body);
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added sucessfully");
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

//Get user by email
app.get("/user", async (req, res) => {
  //get useremail by req params
  //req.body.param should be same as mentioned in Schema
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    //find by email id in db
    //refer to docs for more model methods
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//Get all users from db
app.get("/feed", async (req, res) => {
  try {
    //when we pass {} it returns us all the documents in an array
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
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
