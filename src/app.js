const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const {
  validateSignUpData,
  checkForExistingEmail,
} = require("./utils/validation");

const bcrypt = require("bcrypt");

//This coverts the send json to a javascript object and puts it in req.body
app.use(express.json());

//Creating a post /signup using dynamic data insted of static
app.post("/signup", async (req, res) => {
  try {
    //validate data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    const checkEmail = await User.findOne({ emailId });
    if (checkEmail) {
      return res.status(400).send("Email already exists try logging in");
    }
    //Encrypt password
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added sucessfully");
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

//Login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //finding user with this email in db
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid creds");
    }
    //comparing login password with the one in db
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login successful");
    } else {
      throw new Error("Invalid creds");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
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

//delete user by id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User Deleted");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//update user data by id
app.patch("/user/:userId", async (req, res) => {
  //send as req params
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const allowedUpdateFields = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    //check if updating a field which is not allowed
    //if want to use {} please return explicitly
    const isUpdateFieldAllowed = Object.keys(data).every((k) =>
      allowedUpdateFields.includes(k)
    );
    if (!isUpdateFieldAllowed) {
      throw new Error("Update for field not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cant be more than 10");
    }
    //finding user by id to update
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      //usually its false which means validators are run only when creating new document and not when patching
      //so we need to put this flag as true
      runValidators: true,
    });
    res.send("User Updated");
  } catch (err) {
    res.status(400).send("Update failed: " + err.message);
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
