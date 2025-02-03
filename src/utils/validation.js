const validator = require("validator");
const User = require("../models/user");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Either first name is empty or last name is empty");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a stronk password");
  }
};

module.exports = {
  validateSignUpData,
};
