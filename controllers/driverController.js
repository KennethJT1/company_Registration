import DriverDetail from "../models/driverDetails.js";
import User from "../models/user.js";
import { generateUniquePassword } from "../config/index.js";

export const register = async (req, res) => {
  try {
    const isAdmin = await User.findById(req.User);
    if (isAdmin.role !== "companyAdmin" && isAdmin.role !== "administrator") {
      return res.status(403).json({
        Error: "You are not allowed to register a driver",
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
      clientBonus,
      performanceBonus,
      hmo,
      licenseNumber,
      birthDate,
      licenseClass,
      nin,
      hobbie,
      certification,
      spouseName,
      spouseNumber,
      marital,
      driverStreet,
      driverState,
      driverCountry,
      driverPostalCode,
      kinFullName,
      KinNumber,
      kinRelationship,
      kinStreet,
      kinState,
      kinCountry,
      kinPostalCode,
      guarantorFullName,
      guarantorNumber,
      guarantorRelationship,
      guarantorRelationshipYear,
      guarantorOccupation,
      guarantorPosition,
      guarantorStreet,
      guarantorState,
      guarantorCountry,
      guarantorPostalCode,
      employeeID,
      employmentStartDate,
      employmentPosition,
      employmentSalary,
      employmentPensionProvider,
      employmentDriverLevel,
      employmentReportsTo,
      bank,
      accountNumber,
      accountName,
      bvn,
      pensionBank,
      pensionAccount,
    } = req.body;

    const myDetails = new User({
      firstName,
      lastName,
      email,
      password,
      role: "driver",
      isVerified: true,
      company: isAdmin.company,
    });

    const userSaved = await myDetails.save();
    const data = new DriverDetail({
      primaryDetails: userSaved._id,
      photo,
      number,
      gender,
      benefit: { clientBonus, performanceBonus, hmo },
      pension: {
        bank,
        accountNumber,
        accountName,
        bvn,
        pensionBank,
        pensionAccount,
      },
      driver: {
        licenseNumber,
        birthDate,
        licenseClass,
        nin,
        hobbie,
        certification,
        spouseName,
        spouseNumber,
        marital,
        driverAddress: {
          driverStreet,
          driverState,
          driverCountry,
          driverPostalCode,
        },
      },
      kin: {
        kinFullName,
        KinNumber,
        kinRelationship,
        kinAddress: { kinStreet, kinState, kinCountry, kinPostalCode },
      },
      guarantor: {
        guarantorFullName,
        guarantorNumber,
        guarantorRelationship,
        guarantorRelationshipYear,
        guarantorOccupation,
        guarantorPosition,
        guarantorAddress: {
          guarantorStreet,
          guarantorState,
          guarantorCountry,
          guarantorPostalCode,
        },
      },
      employment: {
        employeeID,
        employmentStartDate,
        employmentPosition,
        employmentSalary,
        employmentPensionProvider,
        employmentDriverLevel,
        employmentReportsTo,
      },
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
        msg: "Driver registered successfully",
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
    const isUser = await User.findById(req.User);
    if (
      isUser.role !== "companyAdmin" &&
      isUser.role !== "administrator" &&
      isUser.role !== "driver"
    ) {
      return res.status(403).json({
        Error: "You are not allowed to view a driver detail",
      });
    }

    const myDetail = await User.findById(isUser._id);
    const { password: _, ...responseUser } = myDetail._doc;
    return res.status(200).json({
      Details: responseUser,
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

    const driver = await DriverDetail.findOne({ primaryDetails: id });
    if(!driver){
      return res.status(200).json({
        Error: "Check your route",
      });
    }else {
      await DriverDetail.findByIdAndRemove(driver._id);
      await User.findByIdAndRemove(id);
      return res.status(200).json({
        msg: "Driver Details deleted successfully",
      });
    }
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ Error: error.message });
  }
};

// export const primaryData = async (req, res) => {
//   try {
//     const { firstName, lastName, email, photo, number, gender, password } =
//       req.body;
//   } catch (error) {
//     console.log("Error", error);
//     return res.status(500).json({ Error: error.message });
//   }
// };

// export const primaryData = async (req, res) => {
//   try {
//     const { firstName, lastName, email, photo, number, gender, password } =
//       req.body;
//   } catch (error) {
//     console.log("Error", error);
//     return res.status(500).json({ Error: error.message });
//   }
// };

// export const myNotification = async (req,res)=> {
//     try {

//     } catch (error) {
// console.log("Register error", error);
// return res.status(500).json({ Error: error.message });
//     }
// };

export const autoGeneratePassword = async (req, res) => {
  try {
    const password = await generateUniquePassword(6);
    return password;
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ Error: error.message });
  }
};
