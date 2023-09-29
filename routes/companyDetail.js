import express from "express";
import * as Company from "../controllers/companyDetailController.js";

//middleware
import { companyAdminAuth, superAdminAuth } from "../middlewares/auth.js";

const companyDetailRouter = express.Router();

companyDetailRouter.post("/register",companyAdminAuth, Company.registerCompany);

// companyDetailRouter.post(
//   "/super-admin-notification",
//   CompanyAdmin.superAdminNotification
// );

export default companyDetailRouter;
