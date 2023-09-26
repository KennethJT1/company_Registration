import { Schema, model } from "mongoose";
import countries from "countries-list";
import slugify from "slugify";

import CompanyAdmin from "./companyAdminModel.js";

const companyDetailSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, required: true, ref: "CompanyAdmin" },
    name: {
      type: String,
      trim: true,
      default: "",
    },
    logo: {
      type: String,
      trim: true,
      default: "",
    },
    subDomain: {
      type: String,
      unique: true,
      index: true,
    },
    firstAddress: {
      type: String,
      required: true,
    },
    secondAddress: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return countries[value] !== undefined;
        },
        message: "Invalid country selection",
      },
    },
    state: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
  }
);

companyDetailSchema.pre("save", function (next) {
  if (!this.isModified("name")) {
    return next();
  }

  this.subdomain = slugify(this.name, { lower: true }) + ".transportdek.com";

  return next();
});

export default model("companyDetail", companyDetailSchema);
