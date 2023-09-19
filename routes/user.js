const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Signup, Equipment, AssignEq } = require("../models/mongodb");
const jwt = require("jsonwebtoken");
const passport = require("../passport");

// const User = require("../models/mongodb");

// const Admin = require("../models/admin");
router.get("/", async (req, res) => {
  try {
    const equipments = await Equipment.find({});

    // Fetch the user's assigned equipments from the database
    const userId = req.session.userId; // Assuming you have the user ID in the session
    const assignedEquipments = await AssignEq.find({
      assignedTo: userId,
    }).exec();

    // Iterate over the assigned equipments and calculate remaining days
    const options = { timeZone: "Asia/Kolkata" };
    const currentDate = new Date().toLocaleString("en-US", options);
    const equipmentNotifications = [];
    console.log(currentDate);

    for (const assignedEquipment of assignedEquipments) {
      const returnDate = assignedEquipment.returnDate;
      const currentDateTimezoneOffset = new Date().getTimezoneOffset() * 60000; // Convert minutes to milliseconds
      const currentTime = new Date(Date.now() - currentDateTimezoneOffset); // Adjust for timezone offset
      const timeDiff = returnDate.getTime() - currentTime.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Create an equipment notification object with the remaining days
      const equipmentNotification = {
        equipmentName: assignedEquipment.assignedEq,
        daysDiff: daysDiff,
      };

      equipmentNotifications.push(equipmentNotification);
    }

    res.render("user.ejs", { equipments, equipmentNotifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  // res.render("user.ejs");
});
// Define the route for user signup
router.post("/savedata", (req, res) => {
  const { username, email, phno, password } = req.body;

  // Generate a salt to use for hashing the password
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return res.status(500).send("Error occurred during password hashing");
    }

    // Hash the password using the generated salt
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) {
        return res.status(500).send("Error occurred during password hashing");
      }

      // Create a new instance of the Signup model with the form data and hashed password
      const newUser = new Signup({
        username: username,
        email: email,
        phno: phno,
        password: hash, // Store the hashed password
      });

      // Save the new user to the database
      newUser
        .save()
        .then(() => {
          res.render("login.ejs");
        })
        .catch((error) => {
          res.status(500).send(error);
        });
    });
  });
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const secretKey = "ayush123";

  try {
    if (username === "admin" && password === "admin123") {
      // For admin user, generate JWT token

      const token = jwt.sign({ username }, secretKey, { expiresIn: "10h" });
      return res.redirect("/admin/dashboard");
    } else {
      passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Error occurred" });
        }

        if (!user) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        req.login(user, { session: false }, (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error occurred" });
          }
          req.session.userId = user._id;
          const token =
            "JWT " +
            jwt.sign(user.toJSON(), secretKey, {
              expiresIn: "10h",
            });

          console.log(token);
          console.log(user._id);
          return res.redirect("/user");
        });
      })(req, res, next);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error occurred");
  }
});

router.get(
  "/user-records",
  // passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const userId = req.session.userId; // Access the user ID from the session

    try {
      // Fetch the user records from the database based on the assignedTo field
      const userRecords = await AssignEq.find({ assignedTo: userId });
      res.render("user-records.ejs", { userRecords });
    } catch (error) {
      console.error("Error retrieving user records:", error);
      res.status(500).json({ error: "Failed to retrieve user records" });
    }
  }
);

module.exports = router;
