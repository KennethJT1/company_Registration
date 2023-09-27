import CompanyAdmin from "../models/companyAdminModel.js";
import Notification from "../models/notificationModel.js";
import { generateUniquePassword } from "../config/index.js";

import dotenv from "dotenv";
dotenv.config();
const superAdminEmail = process.env.SUPERADMINEMAIL;

export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName) {
      return res.status(400).json("First name is required");
    }
    if (!lastName) {
      return res.status(400).json("Last name is required");
    }
    if (!email) {
      return res.status(400).json("Email is required");
    }
    if (!password || password.length <= 6) {
      return res
        .status(400)
        .json("Password is required and must not be less than 6");
    }
    if (confirmPassword !== password) {
      return res
        .status(400)
        .json("Confirm Password must be the same as the password");
    }

    const existingEmail = await CompanyAdmin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Use another email address",
      });
    }

    const admin = new CompanyAdmin({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });
    const token = admin.getSignedJwtToken();

    const { password: _, ...responseUser } = admin._doc;

    await admin.save();

    const notify = Notification.create({
      userEmail: superAdminEmail,
      message: `An admin with this mail ${email} has been registered with this token ${token}`,
    });

    return res.status(201).json({
      msg: "Registered Successfully, Please check your mail for verification",
      User: responseUser,
    });
  } catch (error) {
    console.log("Register error", error);
    return res.status(500).json({ Error: error.message });
  }
};

export const superAdminNotification = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Fill all fields");
  }
  const superAdmin = await CompanyAdmin.findOne({ role: "superAdmin", email });
  if (!superAdmin) {
    return res
      .status(404)
      .json({ Error: "You are not authorize to access this endpoint." });
  }

  const isPassword = await superAdmin.matchPassword(password);
  if (!isPassword) {
    return res.status(404).send({ error: "Invalid password" });
  }

  const notify = await Notification.find({ userEmail: email });

  return res.status(201).json({ Counts: notify.length, Notifications: notify });
};

// export const acceptCompanyAdmin = async (req, res) => {};

// export const rejectCompanyAdmin = async (req,res)=> {};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //all field require validation
    if (!email) {
      return res.json({ error: "Email is wrong" });
    }

    if (!password || password.length < 6) {
      return res.json({ error: "Password must be at least 6 character" });
    }

    //check if email exist
    const admin = await CompanyAdmin.findOne({ email, isVerified: true });
    if (!admin) {
      return res.json({ error: "Admin not found" });
    }

    //compare password
    const comparepassword = await admin.matchPassword(password);

    if (!comparepassword) {
      return res.json({ error: "Wrong password" });
    }

    //create sign jwt
    const token = admin.getSignedJwtToken();
    // const token = jwt.sign(
    //   { _id: admin._id, email: admin.email },
    //   process.env.jwt_secret,
    //   {
    //     expiresIn: "7d",
    //   }
    // );

    const { password: _, ...responseUser } = admin._doc;

    //send response
    res.status(201).json({
      Admin: responseUser,
      Token: token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existingAdmin = await CompanyAdmin.findOne({ email });

    if (!existingAdmin) {
      return res.status(404).json({ error: "Can't find Admin!" });
    }

    const newPassword = generateUniquePassword(6);

    existingAdmin.password = newPassword;
    await existingAdmin.save();

    return res.status(201).json({
      msg: "Your password has been reset, check your email",
      Password: newPassword,
    });
  } catch (error) {
    console.log("ForgotPassword error", error);
    return res.status(500).json({ Error: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const existingAdmin = await CompanyAdmin.findOne({ _id: req.companyAdmin });
    if (!existingAdmin) {
      return res
        .status(404)
        .json({ msg: "Your are not authorize to change password" });
    }

    const isPassword = await existingAdmin.matchPassword(oldPassword);
    if (!isPassword) {
      return res.status(404).send({ error: "invalid password" });
    }

    if (!newPassword || newPassword.length <= 6) {
      return res
        .status(404)
        .send({ error: "Provide a new password and must not be less than 6" });
    }

    existingAdmin.password = newPassword;
    await existingAdmin.save();

    return res.status(201).json({
      msg: "Your password has been reset",
    });
  } catch (error) {
    console.log("ChangePassword error", error);
    return res.status(500).json({ Error: error.message });
  }
};

export const myProfile = async (req, res) => {
  try {
    const admin = await CompanyAdmin.findOne({ _id: req.companyAdmin });

    if (!admin) {
      return res
        .status(404)
        .json({ msg: "You are not authorized to access this profile" });
    }

    const { password: _, ...responseUser } = admin._doc;

    return res.status(200).json({ Admin: responseUser });
  } catch (error) {
    console.log("Myprofile error", error);
    return res.status(500).json({ Error: error.message });
  }
};

// export const myNotification = async (req,res)=> {};
// export const myNotification = async (req,res)=> {};
// export const myNotification = async (req,res)=> {};
// export const myNotification = async (req,res)=> {};
