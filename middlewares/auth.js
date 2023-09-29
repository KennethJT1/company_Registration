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
};

export const superAdminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.companyAdmin._id);
    if (user.role !== "superAdmin") {
      return res.status(401).send("unauthorized");
    } else {
      next();
    }
  } catch (error) {
    return res.status(401).json(error);
  }
};

// export const administratorAuth = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     //Set token from bearer token in header
//     token = req.headers.authorization.split(" ")[1];
//   }

//   // Make sure token exist
//   if (!token) {
//     return res.status(401).json("Not authorize to access this route");
//   }

//   try {
//     //Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     req.administrator = await CompanyAdministrator.findById(decoded.id);

//     next();
//   } catch (err) {
//     console.log("From civilian auth", err.message);
//     return res.status(401).json("Not authorize to access this route");
//   }
// };
