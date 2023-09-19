// routes/equipments.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Equipment, Signup, AssignEq } = require("../models/mongodb");

// GET request to render addeq.ejs
router.get("/add-equipments", (req, res) => {
  res.render("addeq.ejs"); // Render addeq.ejs
});

// Add a new equipment
router.post("/add-equipments", async (req, res) => {
  try {
    const { name, quantity } = req.body;

    // Create a new equipment instance
    const newEquipment = new Equipment({
      name,
      quantity,
    });

    // Save the new equipment to the database
    await newEquipment.save();

    // Fetch the updated list of equipments from the database

    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Get request to render assign.ejs
router.get("/assign-equipments", async (req, res) => {
  try {
    const users = await Signup.find({});
    const equipments = await Equipment.find({});

    res.render("assign.ejs", { equipments, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/assign-equipments", async (req, res) => {
  const { assignedTo, eqName, reqQuantity, assignedDate, returnDate } =
    req.body;

  try {
    // Find the equipment by name
    const equipment = await Equipment.findOne({ name: eqName });
    const user = await Signup.findOne({ _id: assignedTo });

    if (!equipment) {
      return res.status(404).send("Equipment not found");
    }

    // Check if the required quantity is available
    if (equipment.quantity < reqQuantity) {
      return res.status(400).send("Insufficient quantity available");
    }

    // Deduct the assigned quantity from the available quantity
    equipment.quantity -= reqQuantity;

    // Save the updated equipment
    await equipment.save();

    // Create a new assignEquipment instance
    const assignEquipment = new AssignEq({
      assignedTo: assignedTo,
      assignedEq: eqName,
      requiredQuantity: reqQuantity,
      assignedDate: assignedDate,
      returnDate: returnDate,
    });

    // Save the new assignment to the database
    await assignEquipment.save();

    // Fetch the updated list of equipments from the database
    const equipments = await Equipment.find({});
    const users = await Signup.find({});

    res.render("assign.ejs", { equipments, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/return-equipments", async (req, res) => {
  try {
    const assignedEquipments = await AssignEq.find();
    const assignedEquipmentsWithUsernames = await Promise.all(
      assignedEquipments.map(async (equipment) => {
        const user = await Signup.findById(equipment.assignedTo);
        return { ...equipment.toJSON(), username: user.username };
      })
    );
    res.render("returnEq.ejs", {
      assignedEquipments: assignedEquipmentsWithUsernames,
    });
  } catch (error) {
    // Handle error
  }
});

router.post("/return-equipments", async (req, res) => {
  try {
    const assignedEqId = req.body.assignedEqId;

    // Retrieve the assignedEq record from the database
    const assignedEq = await AssignEq.findById(assignedEqId).exec();

    if (!assignedEq) {
      console.error("AssignedEq record not found");
      return res.sendStatus(500);
    }

    // Extract the equipment name and quantity from the assignedEq record
    const equipmentName = assignedEq.assignedEq;
    const assignedQuantity = assignedEq.requiredQuantity;

    // Find the corresponding equipment record based on the equipment name
    const equipment = await Equipment.findOne({ name: equipmentName }).exec();

    if (!equipment) {
      console.error("Equipment record not found");
      return res.sendStatus(500);
    }

    // Update the quantity by adding the assigned quantity
    equipment.quantity += assignedQuantity;

    // Save the updated equipment record
    await equipment.save();

    // Remove the assignedEq record from the database
    await AssignEq.deleteOne({ _id: assignedEqId });

    console.log("AssignedEq record removed");
    // Perform any other necessary operation
  } catch (error) {
    console.error("Error returning equipment:", error);
    return res.sendStatus(500);
  }
});

module.exports = router;
