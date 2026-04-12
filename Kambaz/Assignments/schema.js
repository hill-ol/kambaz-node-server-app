import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    description: String,
    points: Number,
    dueDate: Date,
    availableFrom: Date,
    availableUntil: Date,
    course: String,
  },
  { collection: "assignments" }
);
export default assignmentSchema;