const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Request handler for /test");
  //   console.log("Request handler for /test");
});
app.use("/hello", (req, res) => {
  res.send("Request handler for /hello");
  //   console.log("Request handler for /hello");
});
app.use("/", (req, res) => {
  res.send("Request handler for /");
});
app.listen(6969, () => {
  console.log("Server is up and running");
});
