import express from "express";
import * as Staff from "../controllers/staffController.js";

//middleware
import { companyAdminAuth, superAdminAuth } from "../middlewares/auth.js";

const staffRouter = express.Router();

staffRouter.get("/autogenerate-password", Staff.autoGeneratePassword);

staffRouter.post("/register", companyAdminAuth, Staff.register);
staffRouter.get("/details", companyAdminAuth, Staff.primaryDetail);
staffRouter.delete("/details/:id", companyAdminAuth, Staff.deleteDetail);

// nonDriverRouter.post(
//   "/super-admin-notification",
//   CompanyAdmin.superAdminNotification
// );

export default staffRouter;
