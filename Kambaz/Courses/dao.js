import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  const findAllCourses = () => model.find({}, { name: 1, description: 1 });

  const findCoursesForEnrolledUser = async (userId) => {
    const { enrollments } = db;
    const courses = await model.find({}, { name: 1, description: 1 });
    return courses.filter((course) =>
      enrollments.some((e) => e.user === userId && e.course === course._id)
    );
  };

  const createCourse = (course) => {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  };

  const deleteCourse = (courseId) => {
    db.enrollments = db.enrollments.filter((e) => e.course !== courseId);
    return model.deleteOne({ _id: courseId });
  };

  const updateCourse = (courseId, courseUpdates) => {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  };

  return { findAllCourses, findCoursesForEnrolledUser, createCourse, deleteCourse, updateCourse };
}