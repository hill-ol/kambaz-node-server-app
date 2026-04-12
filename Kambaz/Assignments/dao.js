import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao(db) {
  const findAssignmentsForCourse = (courseId) =>
    model.find({ course: courseId });

  const createAssignment = (assignment) => {
    const newAssignment = { ...assignment, _id: uuidv4() };
    return model.create(newAssignment);
  };

  const deleteAssignment = (assignmentId) =>
    model.deleteOne({ _id: assignmentId });

  const updateAssignment = (assignmentId, updates) =>
    model.updateOne({ _id: assignmentId }, { $set: updates });

  return { findAssignmentsForCourse, createAssignment, deleteAssignment, updateAssignment };
}