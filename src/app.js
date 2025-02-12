const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");

//This coverts the send json to a javascript object and puts it in req.body
app.use(cors());
app.use(express.json());
//allows us to parse cookie from server to req.body
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  console.log("LOL");
  res.send({data: "Hello World!"});
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
//Kanye@
//new pass for kanye :KanyeWest@69
