import express from "express";
import dotenv from "dotenv";
import colours from "colors";
import mongoose from "mongoose";
import logger from "morgan";

import user from "./routes/user.js";
import companyDetail from "./routes/companyDetail.js";
import driverRoute from "./routes/driver.js";
import staff from "./routes/staff.js";

const app = express();

//env variable
dotenv.config();

//Connect to mongoDB
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Database is connected to mongoDB...".blue))
  .catch((err) => console.log("DB ERROR =>", err));
mongoose.set("strictQuery", true);

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger("dev"));

//Routes
app.use("/company", user);
app.use("/company-setup", companyDetail);
app.use("/driver", driverRoute);
app.use("/staff", staff);

//port
const port = process.env.PORT || 4900;

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`.yellow)
);
