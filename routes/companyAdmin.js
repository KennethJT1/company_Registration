import * as CompanyAdmin from "../controllers/companyAdminController.js";
import express from "express";

//middleware
import { companyAdminauth, superAdminAuth } from "../middlewares/auth.js";

const companyRouter = express.Router();

companyRouter.post("/register", CompanyAdmin.registerAdmin);

companyRouter.post(
  "/super-admin-notification",
  CompanyAdmin.superAdminNotification
);

export default companyRouter;
