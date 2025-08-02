import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../Models/userModels.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the token is sent in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      next(); // move to the next middleware or route handler
    } catch (error) {
      console.error("Token verification failed", error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export default protect;
