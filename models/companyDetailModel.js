import { Schema, model } from "mongoose";
import { countries } from "countries-list";

const companyDetailSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    subDomain: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    firstAddress: {
      type: String,
      required: true,
    },
    secondAddress: {
      type: String,
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

export default model("companyDetail", companyDetailSchema);
