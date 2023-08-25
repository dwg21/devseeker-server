const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const config = require("config");

// const { GOOGLE_API_KEY, JWT_KEY, GH_CLIENT_ID, GH_CLIENT_SECRET } = process.env;

const { JWT_KEY } = process.env;
console.log(JWT_KEY);

const User = require("../models/user");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }

  //Password is automatically hashed with pre save method on user shcema

  const createdUser = await User.create({
    name,
    email,
    password,
  });

  console.log("createdUser: ", createdUser);

  //Generate a token

  let token;
  try {
    token = jwt.sign(
      //takes payload (data to encode)
      { userId: createdUser._id, email: createdUser.email },
      JWT_KEY,
      { expiresIn: "1h" } //token expires in 1 hr
    );
  } catch (err) {
    return new CustomError.BadRequestError(
      "Signup failed, please try again later"
    );
  }

  console.log("token: ", token);

  res.status(StatusCodes.OK).json({
    user: {
      name,
      email,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  // check for existing user
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  //Check if password is correct using user model method

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  //everything ok => generate token
  let token;
  try {
    token = jwt.sign(
      //takes payload (data to encode)
      { userId: user._id, email: user.email },
      JWT_KEY,
      { expiresIn: "1h" } //token expires in 1 hr
    );
  } catch (err) {
    return new CustomError.BadRequestError(
      "Login failed, please try again later"
    );
  }

  res.status(StatusCodes.ACCEPTED).json({
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  });
};

module.exports = {
  register,
  login,
};
