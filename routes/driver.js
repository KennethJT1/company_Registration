import express from "express";
import * as Driver from "../controllers/driverController.js";

//middleware
import { companyAdminAuth, superAdminAuth } from "../middlewares/auth.js";

const driverRouter = express.Router();

driverRouter.get("/autogenerate-password", Driver.autoGeneratePassword);

driverRouter.post("/register", companyAdminAuth, Driver.register);
driverRouter.get("/details", companyAdminAuth, Driver.primaryDetail);
driverRouter.delete("/details/:id", companyAdminAuth, Driver.deleteDetail);

// driverRouter.post(
//   "/super-admin-notification",
//   CompanyAdmin.superAdminNotification
// );

export default driverRouter;
