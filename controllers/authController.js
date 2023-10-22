import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Blacklist from "../models/Blacklist.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const register = async (req, res) => {
  const user = await User.create(req.body);
  const token = user.generateJWT();
  res.status(StatusCodes.CREATED).json({
    status: "success",
    name: user.firstName,
    message: "Your account has been successfully created.",
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email && password) {
    throw new BadRequestError("Provide your registered email address");
  } else if (email && !password) {
    throw new BadRequestError("Enter your password");
  } else if (!email && !password) {
    throw new BadRequestError("Provide email address and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError(
      `Sorry. There's no user associated with the email address: ${email}`
    );
  }

  const passwordMatch = user.isPasswordCorrect(password);

  if (!passwordMatch) {
    throw new BadRequestError("Password is incorrect");
  }

  const token = user.generateJWT();
  res.status(StatusCodes.OK).json({
    status: "success",
    name: user.firstName,
    message: "You have successfully logged in.",
    token,
  });
};

const logout = async (req, res) => {
  const authHeader = req.headers.authorization;

  const accessToken = authHeader.split(" ")[1];

  const newBlacklist = new Blacklist({
    token: accessToken,
  });
  await newBlacklist.save();

  res
    .status(200)
    .json({
      status: "success",
      message: "Successfully logged out",
      accessToken,
    });
};

export { register, login, logout };
