import * as CompanyAdmin from "../controllers/companyAdminController.js";
import express from "express";

//middleware
import { companyAdminAuth, superAdminAuth } from "../middlewares/auth.js";

const companyRouter = express.Router();

companyRouter.post("/register", CompanyAdmin.registerAdmin);

companyRouter.post(
  "/super-admin-notification",
  CompanyAdmin.superAdminNotification
);

companyRouter.post("/login", CompanyAdmin.login);

companyRouter.post("/password-reset", CompanyAdmin.forgotPassword);

companyRouter.post(
  "/change-password",
  companyAdminAuth,
  CompanyAdmin.changePassword
);

companyRouter.get("/my-profile", companyAdminAuth, CompanyAdmin.myProfile);

export default companyRouter;
