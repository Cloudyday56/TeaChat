import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
// import bcrypt from 'bcryptjs';

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized, no token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }

    // Find the user by ID from the token
    const user = await User.findById(decoded.userId).select("-password"); //selecting all fields except password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //if authenticated
    req.user = user; //attach user to the request object
    next(); //call the next middleware or route handler

  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
