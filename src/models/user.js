const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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
      //custom validator for email using validator library
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address :3" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      //custom validator for password using validator library
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Enter a stronk password" + value);
        }
      },
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
          throw new Error("Gendah not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      //setting default value
      default: "https://geographyandyou.com/images/user-profile.png",
      //custom validator for photoUrl using validator library
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photu URL" + value);
        }
      },
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

userSchema.methods.getJWT = async function () {
  const user = this;
  //this is expiration by jwt package
  const token = await jwt.sign({ _id: user._id }, "PSEUDO@0901", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};
module.exports = mongoose.model("User", userSchema);
