const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignUpData } = require("../utils/validation");

//Creating a post /signup using dynamic data insted of static
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //finding user with this email in db
    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid creds");
    }
    //comparing login password with the one in db
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //create a jwt token
      const token = await user.getJWT();
      //Add token to cookie and send with the response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      const responseData = { message: "Login successful", data: user };
      console.log("Sending response:", responseData.data); // Log what’s being sent
      res.status(200).json(responseData); // Ensure proper JSON response
    } else {
      throw new Error("Invalid creds");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//Can chain methods if want
authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("User successfully logged out");
});

module.exports = authRouter;
