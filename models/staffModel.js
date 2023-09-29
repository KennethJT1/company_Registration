import { Schema, model } from "mongoose";

const staffSchema = new Schema({
  primaryDetails: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  photo: { type: String },
  number: { type: String, required: true },
  gender: { type: String, required: true, enum: ["male", "female"] },
  bank: { type: String, required: true },
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
  currency: { type: String, default: "NGN" },
  spouseName: { type: String },
  spouseNumber: { type: String },
  employeeID: { type: String, required: true },
  reportsTo: { type: String, default: "" },
  position: { type: String, required: true },
  salary: { type: String, required: true },
  salaryDate: { type: String, default: "" },
});

export default model("Staff", staffSchema);
