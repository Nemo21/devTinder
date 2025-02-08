const express = require("express");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      //get from the json body we sent
      const fromUserId = req.user._id;
      //get from the url we hit
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      //never trust req.body so we do data sanitization
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }
      //to check if the request sent from user even exists or not
      // case it handles sending request to a non existent user
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error(
          "The person you are sending the request to doesnt exist"
        );
      }
      //now checking if the connection already exists or not from A to B OR B to A
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          //check if connection already exists between fromuserid and touserid
          //OR if touserid has already sent a request to fromuserid
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Connection request already exists");
      }
      //all checks are performed and now we will create new instance of connection request model and save it in db
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      //You can only accept or reject the user from whom the request interested came from
      const alllowedStatus = ["accepted", "rejected"];
      if (!alllowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }
      //Check if the person to whom the request is sent to is logged in or not
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId, //if the request even exists or not
        toUserId: loggedInUser._id, //check if person to whom request is sent is logged in or not
        status: "interested", //can only reject or accept a user who is interested in the profile
      });
      if (!connectionRequest) {
        throw new Error("Connection request not found");
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({ message: "Connection Request " + status, data });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);
module.exports = requestRouter;
