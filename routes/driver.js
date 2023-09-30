import express from "express";
import * as Driver from "../controllers/driverController.js";

//middleware
import { companyAdminAuth } from "../middlewares/auth.js";

const driverRouter = express.Router();

driverRouter.get("/autogenerate-password", Driver.autoGeneratePassword);

driverRouter.post("/register", companyAdminAuth, Driver.register);
driverRouter.get(
  "/details/:companyName/:_id",
  companyAdminAuth,
  Driver.primaryDetail
);
driverRouter.delete("/details/:id", companyAdminAuth, Driver.deleteDetail);
driverRouter.patch("/details/:_id/:companyName", companyAdminAuth, Driver.updateDetail);


export default driverRouter;
