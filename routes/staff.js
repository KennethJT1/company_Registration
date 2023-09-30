import express from "express";
import * as Staff from "../controllers/staffController.js";

//middleware
import { companyAdminAuth } from "../middlewares/auth.js";

const staffRouter = express.Router();

staffRouter.get("/autogenerate-password", Staff.autoGeneratePassword);

staffRouter.post("/register", companyAdminAuth, Staff.register);
staffRouter.get(
  "/details/:companyName/:_id",
  companyAdminAuth,
  Staff.primaryDetail
);
staffRouter.delete("/details/:id", companyAdminAuth, Staff.deleteDetail);
staffRouter.patch(
    "/details/:companyName/:_id",
    companyAdminAuth,
  Staff.updateDetail
);

export default staffRouter;
