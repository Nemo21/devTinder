const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    //add checks for entry for db entry and data sanitization
    firstName: {
      type: String,
      required: true, //required field
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      unique: true, //only unique emails allowed
      required: true,
      lowercase: true, //turns the data in lowercase
      trim: true, //turns the data into a data without spaces
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18, //min age is 18
    },
    gender: {
      type: String,
      //custom validator
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      //setting default value
      default: "https://geographyandyou.com/images/user-profile.png",
    },
    about: {
      type: String,
      default: "About having a default description",
    },
    skills: {
      //array of strings
      type: [String],
    },
  },
  {
    // add date representing when doc was created and updated
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
