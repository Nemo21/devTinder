const express = require("express");
const app = express();

//matches all the http method api calls to /test
app.use("/test", (req, res) => {
  res.send("Request handler for /test");
  //   console.log("Request handler for /test");
});

app.delete("/user", (req, res) => {
  res.send("Deleted successfully!");
});
app.post("/user", async (req, res) => {
  console.log(req.body);
  // saving data to DB
  res.send("Data successfully saved to the database!");
});
//this matches ANY ROUTE AND REQUEST starting with /
// and will be overridden by this is its placed at the top
//because the ORDER OF REQUEST HANDLERS MATTERS
//it will check by matching routes from the top

app.use("/", (req, res) => {
  res.send("Request handler for /");
});
// to match specific http methods we use
// This will only handle GET call to /user
app.get("/user", (req, res) => {
  res.send({ firstName: "pseudo", lastName: "bish" });
});
//dynamic url it will get from
//example: /user/100/pseudo/bish
app.get("/user/:userId/:name/:password", (req, res) => {
  console.log(req.params); //will print 100 here
  res.send({ firstName: "pseudo", lastName: "bish" });
});
app.listen(6969, () => {
  console.log("Server is up and running");
});
