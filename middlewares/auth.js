import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const companyAdminAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json("Not authorize to access this route");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.User = await User.findById(decoded.id);

    next();
  } catch (err) {
    console.log("Auth", err.message);
    return res.status(401).json("Not authorize to access this route");
  }
}