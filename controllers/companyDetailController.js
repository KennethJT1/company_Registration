import CompanyDetail from "../models/companyDetailModel.js";
import User from "../models/user.js";
import slugify from "slugify";

export const registerCompany = async (req, res) => {
  try {
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

    const subDomain = `${slugify(name, {
      lower: true,
      remove: /[*+~.()'"!:@]/g,
    })}.transportdek.com`;

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
    const owner = req.User;

    const company = new CompanyDetail({
      name,
      subDomain,
      logo,
      firstAddress,
      secondAddress,
      city,
      postalCode,
      country,
      state,
      telephone,
      timeZone,
      owner,
    });

    await company.save();
    if (company) {
      await User.findByIdAndUpdate(
        req.User,
        { company: subDomain },
        { new: true }
      );
    }

    return res.status(201).json({
      msg: `${name} has been registered Successfully`,
      Company: company,
    });
  } catch (error) {
    console.log("Register error", error);
    return res.status(500).json({ Error: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { companyName, _id } = req.params;

    const isUser = await User.findById(req.User);
    if (isUser.role !== "companyAdmin") {
      return res.status(403).json({
        Error: "You are not allowed to edit company details",
      });
    } else if (isUser.company !== companyName) {
      return res.status(403).json({
        Error: "You need to be from the company's admin before you can edit",
      });
    }

    const company = await CompanyDetail.findByIdAndUpdate(
      { _id, subDomain: companyName },
      { ...req.body },
      { new: true }
    );

    if (company === null) {
      return res.status(404).json({
        Error: "Wrong Credentials",
      });
    }

    return res.status(201).json({
      Details: company,
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ Error: error.message });
  }
};

export const removeCompany = async (req, res) => {
  try {
    const { companyName, _id } = req.params;

    const isUser = await User.findById(req.User);
    if (isUser.role !== "companyAdmin" && isUser.role !== "superAdmin") {
      return res.status(403).json({
        Error: "You are not allowed to remove this company",
      });
    } else if (isUser.role === "superAdmin") {
      const company = await CompanyDetail.findOne({_id});
      if (!company) {
        return res.status(404).json({
          Error: "Wrong Credentials",
        });
      }

      const isRemoved = await CompanyDetail.deleteOne({_id});
      if (isRemoved) {
        await User.findByIdAndUpdate(
          { _id: company.owner },
          { company: "" },
          { new: true }
        );
      }
      return res.status(403).json({
        msg: "Company successfully removed",
      });
    } else if (isUser.company !== companyName) {
      return res.status(403).json({
        Error: "You need to be from the company's admin before you can remove",
      });
    }

    const company = await CompanyDetail.findByIdAndRemove(_id);
    if (company === null) {
      return res.status(404).json({
        Error: "Wrong Credentials",
      });
    }

    if (company) {
      await User.findByIdAndUpdate(
        { _id: isUser._id },
        { company: "" },
        { new: true }
      );
    }
    return res.status(403).json({
      msg: "Company successfully removed",
    });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).json({ Error: error.message });
  }
};
// export const registerCompany = async (req,res)=> {};
// export const registerCompany = async (req,res)=> {};
// export const registerCompany = async (req,res)=> {};
