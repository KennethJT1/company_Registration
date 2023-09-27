import jwt from 'jsonwebtoken';
import CompanyAdmin from '../models/companyAdminModel.js'

export const companyAdminAuth = async(req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      //Set token from bearer token in header
      token = req.headers.authorization.split(" ")[1];
    }
  
    // Make sure token exist
    if (!token) {
      return res.status(401).json("Not authorize to access this route");
    }
  
    try {
      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      req.companyAdmin = await CompanyAdmin.findById(decoded.id);
  
      next();
    } catch (err) {
      console.log("From civilian auth", err.message);
      return res.status(401).json("Not authorize to access this route");
    }
    
}

export const superAdminAuth = async (req, res, next) => {
    try {

       const user = await CompanyAdmin.findById(req.companyAdmin._id);
       if(user.role !== "superAdmin") {
        return res.status(401).send("unauthorized");
       } else {
        next();
       }
       
    } catch (error) {
        return res.status(401).json(error)
    }
    
}