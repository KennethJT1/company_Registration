import * as CompanyAdmin from "../controllers/userController.js";
import express from "express";

//middleware
import { companyAdminAuth } from "../middlewares/auth.js";

const companyRouter = express.Router();

companyRouter.post("/register", CompanyAdmin.registerAdmin);

companyRouter.get(
  "/super-admin-notification",
  companyAdminAuth,
  CompanyAdmin.superAdminNotification
);

companyRouter.post(
  "/accept",
  companyAdminAuth,
  CompanyAdmin.superAdminAcceptUser
);

companyRouter.post(
  "/reject",
  companyAdminAuth,
  CompanyAdmin.superAdminRejectUser
);

companyRouter.put(
  "/verify/:verifiedToken",
  companyAdminAuth,
  CompanyAdmin.verifyUser
);

companyRouter.post("/resend-token", CompanyAdmin.resendVerificationToken);

companyRouter.post("/login", CompanyAdmin.login);

companyRouter.post("/password-reset", CompanyAdmin.forgotPassword);

companyRouter.post(
  "/change-password",
  companyAdminAuth,
  CompanyAdmin.changePassword
);

companyRouter.get("/my-profile", companyAdminAuth, CompanyAdmin.myProfile);

companyRouter.post(
  "/create-administrator",
  companyAdminAuth,
  CompanyAdmin.createAdministrator
);

companyRouter.delete(
  "/delete-administrator/:_id/:company",
  companyAdminAuth,
  CompanyAdmin.deleteAdministrator
);

companyRouter.patch("/edit", companyAdminAuth, CompanyAdmin.editProfile);

export default companyRouter;
