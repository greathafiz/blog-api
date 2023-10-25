import { UnauthorizedError } from "../errors/index.js";
import Blacklist from "../models/Blacklist.js";
import jwt from "jsonwebtoken";

const verifyUser = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    throw new UnauthorizedError("Authentication failed. You are not authorized to access this route");
  }

  const token = req.headers.authorization.split(" ")[1];

  const checkIfBlacklisted = await Blacklist.findOne({ token: token });
  // if true, send an unauthorized message, asking for a re-authentication.
  if (checkIfBlacklisted)
    throw new UnauthorizedError("This session has expired. Kindly login again");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { name: decoded.name, userId: decoded.userId };
    next();
  } catch (error) {
    throw new UnauthorizedError(
      `Authentication failed. You are not authorized to access this route`
    );
  }
};

export default verifyUser;
