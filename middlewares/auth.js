import jwt from 'jsonwebtoken';
import CompanyAdmin from '../models/companyAdminModel.js'

export const companyAdminauth = (req, res, next) => {
    try {
       const decoded = jwt.verify(req.headers.authorization, process.env.jwt_secret);

       req.companyAdmin = decoded;
       next();
    } catch (error) {
        return res.status(401).json(error)
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