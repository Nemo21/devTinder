const express = require("express");
const userRouter = express.Router();
const User = require("../models/user");
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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    //we are creating pagination
    //default values if no query passed
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    //making sure that request is le(less than equal) to 50;
    limit = limit > 50 ? 50 : limit;
    //DRY RUN BY
    //  /feed?page=1&limit=10 => 1-10 => .skip(0) & .limit(10)
    //  /feed?page=2&limit=10 => 11-20 => .skip(10) & .limit(10)
    //  /feed?page=3&limit=10 => 21-30 => .skip(20) & .limit(10)
    //  /feed?page=4&limit=10 => 21-30 => .skip(20) & .limit(10)
    const skipRecords = (page - 1) * limit;
    const connectionRequest = await ConnectionRequest.find({
      //Selects the users whom the logged in user has sent(first) OR recieved the connection request(second)
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    //we want to show users which whom loggedin user HAS NOT sent or received a request from
    const hiddenUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hiddenUsersFromFeed.add(req.fromUserId.toString());
      hiddenUsersFromFeed.add(req.toUserId, toString());
    });

    const users = await User.find({
      $and: [
        //profiles of his connections and people who have either sent him the request or got the request from him
        { _id: { $nin: Array.from(hiddenUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
        //not shown his own profile
      ],
    })
      .select("firstName lastName photoUrl age gender about skills")
      .skip(skipRecords)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = userRouter;
