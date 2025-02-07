const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      //its the mongodb databases ._id
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        //enum: restricts the users to these options only,others are invalid
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

//Indexes support efficient execution of queries in MongoDB.
//Without indexes, MongoDB must scan every document in a collection to return query results.
//refer mongodb docs it basically speeds up our complex queries

//this is a compound index which will speed up our query when using both these parameters together
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//before saving the data we will finally check if the person has sent the request to themselves
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if both object ids are same or not
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(
      "Why tf would you send a request to yourself you lonely fuck"
    );
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequest;
