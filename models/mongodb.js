const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const db =
  "mongodb+srv://aayushhariya999:charyush141@cluster0.eurmdeg.mongodb.net/Inventory-app?retryWrites=true&w=majority";
mongoose
  .connect(db)

  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(() => {
    console.log("Failed to connect");
  });

const signupSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phno: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

signupSchema.methods.validatePassword = async function (password) {
  try {
    // Compare the provided password with the stored password hash
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const Signup = new mongoose.model("Signup", signupSchema);

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const Equipment = new mongoose.model("Equipment", equipmentSchema);

const assignEquipment = new mongoose.Schema({
  assignedTo: {
    type: String,
    required: true, // Reference to the UserSignup schema
  },

  assignedEq: {
    type: String,
    required: true,
  },

  // assignedEq: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Equipment",
  // },

  requiredQuantity: {
    type: Number,
  },
  assignedDate: {
    type: Date,
  },
  returnDate: {
    type: Date,
  },
});
const AssignEq = new mongoose.model("AssignEq", assignEquipment);

module.exports = { Signup, Equipment, AssignEq };
