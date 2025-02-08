const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

//get all pending connection requests of a loggedin user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    //this will only return us id of the user who sent request
    //what we need is somehow information about the user who sent request
    //we use ref and populate to achieve that
    //we make a ref from this collection to user collection
    // and populate data from user collection here
    res.json({
      message: "Data fetched",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        //find a request where the logged in user has sent a request which is accepted
        //or some request which was sent to logged in user and they accepted it
        //it now means they are mutual friends now
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ["firstName", "lastName"])
      .populate("toUserId", ["firstName", "lastName"]);
    const data = connectionRequest.map((row) => {
      //if fromuserid matches loggedin user it should show the person who accepted their request
      //and vica versa

      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send("Error: ", err.message);
  }
});
module.exports = userRouter;
