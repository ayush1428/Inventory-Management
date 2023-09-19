// const express = require("express");
// const app = express();
// const ejs = require("ejs");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const user = require("./routes/user");
// const admin = require("./routes/admin");
// const path = require("path");
// const { Equipment, Signup } = require("./models/mongodb");
// const equipmentsRoutes = require("./routes/equipments");
// const passport = require("./passport");
// app.use(passport.initialize());

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use("/user", user);
// app.use("/admin", admin);
// app.use(express.static(__dirname + "/public"));
// app.use(express.static(path.join(__dirname, "views")));
// app.use("/equipments", equipmentsRoutes);

// // Routes
// app.get("/home", (req, res) => {
//   res.render("signup.ejs");
// });

// //for /login
// app.get("/login", (req, res) => {
//   res.render("login.ejs");
// });

// // Start the server
// app.listen(5000, () => {
//   console.log("Server is running on http://localhost:5000");
// });

const express = require("express");
const session = require("express-session");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const user = require("./routes/user");
const admin = require("./routes/admin");
const path = require("path");
const { Equipment, Signup } = require("./models/mongodb");
const equipmentsRoutes = require("./routes/equipments");
const passport = require("./passport");

// Set up session middleware
app.use(
  session({
    secret: "ayush123", // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/user", user);
app.use("/admin", admin);
app.use(express.static(__dirname + "/public"));
app.use(express.static(path.join(__dirname, "views")));
app.use("/equipments", equipmentsRoutes);

// Routes
app.get("/home", (req, res) => {
  res.render("signup.ejs");
});

// for /login
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
