import Staff from "../models/staffModel.js";
import User from "../models/user.js";
import { generateUniquePassword } from "../config/index.js";

export const register = async (req, res) => {
  try {
    const isAdmin = await User.findById(req.User);
    if (isAdmin.role !== "companyAdmin" && isAdmin.role !== "administrator") {
      return res.status(403).json({
        Error: "You are not allowed to register a staff",
      });
    }

    const {
      firstName,
      lastName,
      email,
      photo,
      number,
      gender,
      password,
      bank,
      accountNumber,
      accountName,
      currency,
      spouseName,
      spouseNumber,
      employeeID,
      reportsTo,
      position,
      salary,
      salaryDate,
    } = req.body;

    const myDetails = new User({
      firstName,
      lastName,
      email,
      password,
      role: "staff",
      isVerified: true,
      company: isAdmin.company,
    });

    const userSaved = await myDetails.save();

    const data = new Staff({
      primaryDetails: userSaved._id,
      photo,
      number,
      gender,
      bank,
      accountNumber,
      accountName,
      currency,
      spouseName,
      spouseNumber,
      employeeID,
      reportsTo,
      position,
      salary,
      salaryDate,
    });

    if (userSaved) {
      const allData = await data.save(userSaved._id);
      if (!allData) {
        await User.findByIdAndRemove();
        return res.status(204).json({
          Error: "Data could not be saved",
        });
      }
      return res.status(201).json({
        msg: "Staff successfully registered",
        User: userSaved,
      });
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ Error: error.message });
  }
};

export const primaryDetail = async (req, res) => {
  try {
    const { companyName, _id } = req.params;

    const isUser = await User.findById(req.User);
    if (
      isUser.role !== "companyAdmin" &&
      isUser.role !== "administrator" &&
      isUser.role !== "staff"
    ) {
      return res.status(403).json({
        Error: "You are not allowed to view a staff detail",
      });
    } else if (isUser.company !== companyName) {
      return res.status(403).json({
        Error:
          "You need to be from the staff company before you can view this profile",
      });
    }

    const myDetail = await Staff.findById(_id);
    const myDetail2 = await User.findById({ _id: myDetail.primaryDetails });
    const { password: _, ...responseUser } = myDetail2._doc;
    return res.status(200).json({
      PrimaryData: responseUser,
      Details: myDetail,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ Error: error.message });
  }
};

export const deleteDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const isUser = await User.findById(req.User);
    if (isUser.role !== "companyAdmin" && isUser.role !== "administrator") {
      return res.status(403).json({
        Error: "You are not allowed to delete a staff detail",
      });
    }

    const staff = await Staff.findOne({ primaryDetails: id });
    if (!staff) {
      return res.status(200).json({
        Error: "Check your route",
      });
    } else {
      await Staff.findByIdAndRemove(staff._id);
      await User.findByIdAndRemove(id);
      return res.status(200).json({
        msg: "Staff Details deleted successfully",
      });
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ Error: error.message });
  }
};

export const updateDetail = async (req, res) => {
  try {
    const {  companyName,_id } = req.params;

    const isUser = await User.findById(req.User);

    if (isUser.role !== "companyAdmin" && isUser.role !== "administrator") {
      return res.status(403).json({
        Error: "You are not allowed to update a staff detail",
      });
    } 
    
    if (isUser.company !== companyName) {
      return res.status(403).json({
        Error:
          "You need to be from the staff company before you can update this profile",
      });
    }

    const myDetail = await Staff.findByIdAndUpdate(_id, { ...req.body }, {
      new: true,
    });

    if (myDetail === null) {
      return res.status(404).json({
        Error: "Wrong identity",
      });
    }
    

    return res.status(201).json({
      Details: myDetail,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ Error: error.message });
  }
};

export const autoGeneratePassword = async (req, res) => {
  try {
    const password = await generateUniquePassword(6);
    return password;
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ Error: error.message });
  }
};
