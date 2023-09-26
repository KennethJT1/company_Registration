import express from "express";
import * as Company from "../controllers/companyDetailController.js";

//middleware
import { companyAdminauth, superAdminAuth } from "../middlewares/auth.js";

const companyDetailRouter = express.Router();

companyRouter.post("/register", Company.registerCompany);

// companyRouter.post(
//   "/super-admin-notification",
//   CompanyAdmin.superAdminNotification
// );

export default companyDetailRouter;
