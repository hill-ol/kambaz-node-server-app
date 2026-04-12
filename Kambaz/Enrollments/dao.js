import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  const enrollUserInCourse = (userId, courseId) => {
    return model.create({
      _id: `${userId}-${courseId}`,
      user: userId,
      course: courseId,
    });
  };

  const unenrollUserFromCourse = (userId, courseId) => {
    return model.deleteOne({ user: userId, course: courseId });
  };

  const findAllEnrollments = () => model.find();

  const findCoursesForUser = async (userId) => {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((e) => e.course);
  };

  const findUsersForCourse = async (courseId) => {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((e) => e.user);
  };

  const unenrollAllUsersFromCourse = (courseId) => {
    return model.deleteMany({ course: courseId });
  };

  return {
    enrollUserInCourse, unenrollUserFromCourse, findAllEnrollments,
    findCoursesForUser, findUsersForCourse, unenrollAllUsersFromCourse,
  };
}