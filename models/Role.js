import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
      required: true,
      unique: true,
    },
    permissions: {
      type: [String],
      default: [],
    },
  }
);

export default mongoose.model("Role", roleSchema);
