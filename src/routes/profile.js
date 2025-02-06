const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const profileRouter = express.Router();

//View your profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; //got from the userAuth middleware
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: ", error);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
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
    //Get the req.body.password
    //Check for stronk password
    //Set new password,hash it and save it in db await password.save()
  } catch (error) {
    res.status(400).send("Error: ", error.message);
  }
});

module.exports = profileRouter;
