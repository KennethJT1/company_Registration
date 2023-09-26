import CompanyDetail from "../models/companyDetailModel.js";
import CompanyAdmin from "../models/companyAdminModel.js";

export const registerCompany = async (req, res) => {
  try {
    const admin = await CompanyAdmin.findOne({})
    const {
      name,
      logo,
      firstAddress,
      secondAddress,
      city,
      postalCode,
      country,
      state,
      telephone,
      timeZone,
    } = req.body;

    if (!firstAddress) {
      return res.status(400).json("Address line 1 is required");
    }
    if (!city) {
      return res.status(400).json("City is required");
    }
    if (!state) {
      return res.status(400).json("State is required");
    }
    if (!postalCode) {
      return res.status(400).json("PostalCode is required");
    }
    if (!country) {
      return res.status(400).json("Country is required");
    }
    if (!telephone) {
      return res.status(400).json("Telephone is required");
    }

    const existingCompany = await CompanyDetail.findOne({ subDomain });
    if (existingCompany) {
      return res.status(400).json({
        error: "Use another company name",
      });
    }

    const company = new CompanyAdmin({
      name,
      logo,
      firstAddress,
      secondAddress,
      city,
      postalCode,
      country,
      state,
      telephone,
      timeZone,
    });

    await company.save();

    return res.status(201).json({
      msg: `${name} has been registered Successfully`,
      Company: company,
    });
  } catch (error) {
    console.log("Register error", error);
    return res.status(500).json({ Error: error.message });
  }
};

// export const registerCompany = async (req,res)=> {};
// export const registerCompany = async (req,res)=> {};
// export const registerCompany = async (req,res)=> {};
// export const registerCompany = async (req,res)=> {};
// export const registerCompany = async (req,res)=> {};
