const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { userAuth } = require("./middlewares/auth");

//This coverts the send json to a javascript object and puts it in req.body
app.use(express.json());
//allows us to parse cookie from server to req.body
app.use(cookieParser());

//Creating a post /signup using dynamic data insted of static
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
      //this is expiration for cookie by express
      res.send("Login successful");
    } else {
      throw new Error("Invalid creds");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//get profile
app.get("/profile", async (req, res) => {
  try {
    //getting cookies as req.cookies thanks to cookie parser
    const cookies = req.cookies;
    //get token out of cookie object
    const { token } = cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    //verify token by checking id and searching same id in db
    const verification = jwt.verify(token, "PSEUDO@0901");
    const { _id } = verification;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send("Error: ", error);
  }
});
//Get user by email
app.get("/user", async (req, res) => {
  //get useremail by req params
  //req.body.param should be same as mentioned in Schema
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    //find by email id in db
    //refer to docs for more model methods
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user; //got from the userAuth middleware
  console.log("Sending a connection request");
  res.send(user.firstName + " sent the connection request");
});

connectDB()
  .then(() => {
    console.log("Db connection made");
    app.listen(6969, () => {
      console.log("Server is up and running!");
    });
  })
  .catch((err) => {
    console.error("Db connection not made");
  });

//Pseudo@0901
//Dojacat@069
//Kanye@069
