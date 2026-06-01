import mongoose, { Schema } from "mongoose";

const ServiceSchema = new Schema(
  {
    name: String,

    description: String,

    price: Number,

    duration: Number,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Service ||
  mongoose.model("Service", ServiceSchema);