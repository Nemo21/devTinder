const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validatePasswordChange,
  checkPasswordValidity,
} = require("../utils/validation");
const validator = require("validator");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");

//View your profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; //got from the userAuth middleware
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: ", error);
  }
});

profileRouter.put("/profile/edit", userAuth, async (req, res) => {
  console.log("Received PATCH request to /profile/edit");
  try {
    //check if in request client is editing a field which is not allowed
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Field Edit Request");
    }
    //we will get logged in user info from request params
    const loggedInUser = req.user;
    //iterate over all keys of js object and for each individual field
    // update the logged in user info with the new info provided by client
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    //finally saving the changes into the db
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} , your profile has been updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    //User needs to be logged in taken care by userAuth
    //Validate req.body by using allowed field array as only password and nothing else
    const loggedInUser = req.user;
    if (!validatePasswordChange(req)) {
      throw new Error("Only password edit is allowed");
    }
    const newPassword = req.body.password;
    const isStronkPassword = validator.isStrongPassword(newPassword);
    if (!isStronkPassword) {
      throw new Error("Enter a stronk password pwease");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = passwordHash));
    await loggedInUser.save();

    //$2b$10$d/werkKy09XgvelooX2M8uCzifn1sMebVk0dbJwk.DIFQH1IGhIKq
    //$2b$10$ANneC0C0lm/IRUI59SeiDudz/0jGp2TkT3m2o53sfSeAbP4EI24/e
    // console.log(loggedInUser);
    // console.log(password);
    // console.log(req.body);

    // console.log(passwordHash);
    // console.log(loggedInUser);
    res.json({
      message: `${loggedInUser.firstName} , your password has been updated successfully`,
      data: loggedInUser,
    });
    //Get the req.body.password
    //Check for stronk password
    //Set new password,hash it and save it in db await password.save()
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
