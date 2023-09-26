import CompanyAdmin from "../models/companyAdminModel.js";
import Notification from "../models/notificationModel.js";

const superAdminEmail = "jerry@example.com";

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
    if (!password) {
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
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ error: "User not found" });
    }

    //compare password
    const comparepassword = await comparePassword(password, user.password);

    if (!comparepassword) {
      return res.json({ error: "Wrong password" });
    }

    //create sign jwt
    const token = jwt.sign({ _id: user._id }, process.env.jwt_secret, {
      expiresIn: "7d",
    });

    //send response
    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};
// export const myNotification = async (req,res)=> {};
// export const myNotification = async (req,res)=> {};
// export const myNotification = async (req,res)=> {};
// export const myNotification = async (req,res)=> {};
// export const myNotification = async (req,res)=> {};
