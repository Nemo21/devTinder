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
//usually use app.all("/") for middlewares
//can have multiple route handlers
//the route handlers which have next() are called middlewaress
//app.use("/route", rH, [rH2, rH3], rH4, rh5);
// app.get(
//   "/user",
//   (req, res, next) => { //next is a function given by express
//     console.log("Handling the route user!!");
//     next(); //this is a middleware
//   },
//   (req, res, next) => {
//     console.log("Handling the route user 2!!");
//       res.send("2nd Response!!"); //connection closed after this
//     next();
//   },
//   (req, res, next) => {
//     console.log("Handling the route user 3!!");
// res.send("3rd Response!!");
//     next(); not executed
//   },
//   (req, res, next) => {
//     console.log("Handling the route user 4!!");
//      res.send("4th Response!!");
//     next();
//   },
//   (req, res, next) => {
//     console.log("Handling the route user 5!!");
//     res.send("5th Response!!");
//   }
// );
// app.get("/user/:userId/:name/:password", (req, res) => {
//   console.log(req.params); //will print 100 here
//   res.send({ firstName: "pseudo", lastName: "bish" });
// });

// const { adminAuth, userAuth } = require("./middlewares/auth");
// app.use("/admin", adminAuth);
// app.post("/user/login", (req, res) => {
//   res.send("User logged in successfully!");
// });
// app.get("/user/data", userAuth, (req, res) => {
//   res.send("User Data Sent");
// });
// app.get("/admin/getAllData", (req, res) => {
//   res.send("All Data Sent");
// });
// app.get("/admin/deleteUser", (req, res) => {
//   res.send("Deleted a user");
// });

app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("something went wrong");
  }
});
app.get("/getUserData", (req, res) => {
  //try {
  // Logic of DB call and get user data

  throw new Error("dvbzhjf");
  res.send("User Data Sent");
  //   } catch (err) {
  //     res.status(500).send("Some Error contact support team");
  //   }
});

//use try and catch for error handling
app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("something went wrong");
  }
});
app.listen(6969, () => {
  console.log("Server is up and running");
});
