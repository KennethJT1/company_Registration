import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import Notification from "../models/notificationModel.js";
import { generateUniquePassword, sendEmail } from "../config/index.js";

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

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Use another email address",
      });
    }

    const admin = new User({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    });

    const { password: _, ...responseUser } = admin._doc;

    await admin.save();

    const notify = Notification.create({
      userEmail: superAdminEmail,
      message: `An admin with this mail ${email} has been registered.`,
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
  const isAdmin = req.User;
  if (isAdmin.role !== "superAdmin") {
    return res.status(404).json({
      Error: "Not permitted",
    });
  }

  const notify = await Notification.find({ userEmail: isAdmin.email });

  return res.status(200).json({ Counts: notify.length, Notifications: notify });
};

export const superAdminAcceptUser = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ _id: req.User });

  if (!user) {
    return res
      .status(404)
      .json({ msg: "You are not authorized to access this route" });
  } else if (user.role !== "superAdmin") {
    return res
      .status(404)
      .json({ msg: "You are not permited to accept this user" });
  }

  const verifiedToken = await jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/company/verify/${verifiedToken}`;

  const message = `You are receiving this email because you (or someone else) has registered on TransportDek as a company admin. This will expire in 10 mins. Click the link below: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email,
      subject: "Verification Token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Email could not send" });
  }
};

// export const rejectUser = async (req,res)=> {};

export const verifyUser = async (req, res) => {
  try {
    const { verifiedToken } = req.params;
    const verifyToken = await jwt.verify(verifiedToken, process.env.JWT_SECRET);

    const isUser = await User.findOne({ email: verifyToken.email });
    if (!isUser) {
      return res.status(404).json({ Error: "Wrong token" });
    }
    await User.findByIdAndUpdate(
      { _id: isUser._id },
      { isVerified: true },
      { new: true }
    );
    return res.status(201).json({ msg: "You can create a company now" });
  } catch (error) {
    console.log(err);
    return res.status(500).json({ Error: err.message });
  }
};

export const resendVerificationToken = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res
      .status(404)
      .json({ msg: "Please register" });
  }

  const verifiedToken = await jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/company/verify/${verifiedToken}`;

  const message = `You are receiving this email because you (or someone else) has registered on TransportDek as a company admin. This will expire in 10 mins. Click the link below: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email,
      subject: "Verification Token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ Error: "Email could not send" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, company } = req.body;

    if (!email) {
      return res.json({ error: "Email is wrong" });
    }

    if (!password || password.length < 6) {
      return res.json({ error: "Password must be at least 6 characters" });
    }

    const admin = await User.findOne({ email, isVerified: true });

    if (!admin) {
      return res.json({ error: "User not found" });
    }

    const token = admin.getSignedJwtToken();

    const { password: _, ...responseUser } = admin._doc;

    if (admin.role === "superAdmin") {
      return res.status(201).json({
        User: responseUser,
        Token: token,
      });
    } else {
      if (!company) {
        return res.json({ error: "Choose a company" });
      }

      if (admin.company !== company) {
        return res.json({ error: "Invalid company" });
      }
    }

    const comparePassword = await admin.matchPassword(password);

    if (!comparePassword) {
      return res.json({ error: "Wrong password" });
    }

    res.status(201).json({
      User: responseUser,
      Token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const existingAdmin = await User.findOne({ email });

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

    const existingAdmin = await User.findOne({ _id: req.User });
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
    const admin = await User.findOne({ _id: req.User });

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

export const createAdministrator = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    const isAdmin = await User.findById(req.User);
    if (isAdmin.role !== "companyAdmin") {
      return res.status(404).json({
        Error: "You are not allowed to create an administrator",
      });
    }

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

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: "Email in use",
      });
    }

    const admin = new User({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      role: "administrator",
      isVerified: true,
      company: isAdmin.company,
    });
    const { password: _, ...responseUser } = admin._doc;

    await admin.save();

    return res.status(201).json({
      msg: "Administrator registered Successfully",
      User: responseUser,
    });
  } catch (error) {
    console.log("Administrator Register error", error);
    return res.status(500).json({ Error: error.message });
  }
};

// export const myNotification = async (req,res)=> {};
// export const myNotification = async (req,res)=> {};
