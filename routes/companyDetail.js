import express from "express";
import * as Company from "../controllers/companyDetailController.js";

//middleware
import { companyAdminAuth } from "../middlewares/auth.js";

const companyDetailRouter = express.Router();

companyDetailRouter.post(
  "/register",
  companyAdminAuth,
  Company.registerCompany
);

companyDetailRouter.patch(
  "/update/:_id/:companyName",
  companyAdminAuth,
  Company.updateCompany
);

companyDetailRouter.delete(
  "/remove/:_id/:companyName",
  companyAdminAuth,
  Company.removeCompany
);

export default companyDetailRouter;
