import mongoose from "mongoose";
import app from "./app.js";
import { env } from "./config/env.js";

await mongoose.connect(env.dbUri);
console.log("MongoDB Connected Successfully");

app.listen(env.port, () => {
  console.log(`HRMS API listening on http://localhost:${env.port}`);
});
