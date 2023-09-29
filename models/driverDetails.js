import { Schema, model } from "mongoose";

const driverSchema = new Schema({
  primaryDetails: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  photo: { type: String },
  number: { type: String, required: true },
  gender: { type: String, required: true, enum: ["male", "female"] },
  benefit: {
    clientBonus: { type: String, required: true },
    performanceBonus: { type: String, required: true },
    hmo: { type: String, required: true },
  },

  pension: {
    bank: { type: String, required: true },
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    bvn: { type: String, required: true },
    pensionBank: { type: String },
    pensionAccount: { type: String },
  },

  kin: {
    kinFullName: { type: String, required: true },
    KinNumber: { type: String, required: true },
    kinRelationship: { type: String, required: true },
    kinAddress: {
      kinStreet: { type: String },
      kinState: { type: String },
      kinCountry: { type: String },
      kinPostalCode: { type: String },
    },
  },

  guarantor: {
    guarantorFullName: { type: String, required: true },
    guarantorNumber: { type: String, required: true },
    guarantorRelationship: { type: String, required: true },
    guarantorRelationshipYear: { type: String, required: true },
    guarantorOccupation: { type: String, required: true },
    guarantorPosition: { type: String, required: true },
    guarantorAddress: {
      guarantorStreet: { type: String },
      guarantorState: { type: String },
      guarantorCountry: { type: String },
      guarantorPostalCode: { type: String },
    },
  },

  employment: {
    employeeID: { type: String, required: true },
    employmentStartDate: { type: Date, required: true },
    employmentPosition: { type: String, required: true },
    employmentSalary: { type: String, required: true },
    employmentPensionProvider: { type: String },
    employmentDriverLevel: { type: String },
    employmentReportsTo: { type: String, required: true },
  },

  driver: {
    licenseNumber: { type: String, required: true },
    birthDate: { type: String, required: true },
    licenseClass: { type: String },
    nin: { type: String, required: true },
    certification: { type: String },
    hobbie: { type: String },
    marital: { type: String, required: true, enum: ["single", "married"] },
    spouseName: { type: String },
    spouseNumber: { type: String },
    driverAddress: {
      driverStreet: { type: String },
      driverState: { type: String },
      driverCountry: { type: String },
      driverPostalCode: { type: String },
    },
  },
});

export default model("Driver", driverSchema);
