const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken")

const generateToken = (id) =>{
  return jwt.sign({id}, process.env.JWT_SECRET , {expiresIn:"1d"})

}

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation
  //if any of the field is not filled by user then throw error
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  // if password length is less than 8 characters then error
  if (password.length < 8) {
    res.status(400);
    throw new Error("Password must contain atleast 8 characters");
  }

  //check if email/user already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    res.status(400);
    throw new Error("This email has already been used");
  }

  //create new user
  const user = await User.create({
    name, //name:user.name , when properties's name are same no need to write it
    email,
    password,
  });

  //calling generate token function and passing user id
  const token = generateToken(user._id)

  //if user already exists
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
      token //to see the token received by the user
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

module.exports = registerUser;
