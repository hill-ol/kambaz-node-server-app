import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.json(courses);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) { res.sendStatus(401); return; }
      userId = currentUser._id;
    }
    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const findMyEnrollments = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const enrollments = await enrollmentsDao.findAllEnrollments();
    const myEnrollments = enrollments.filter((e) => e.user === currentUser._id);
    res.json(myEnrollments);
  };

  const createCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const newCourse = await dao.createCourse(req.body);
    await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = async (req, res) => {
    await enrollmentsDao.unenrollAllUsersFromCourse(req.params.courseId);
    await dao.deleteCourse(req.params.courseId);
    res.sendStatus(200);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    await dao.updateCourse(courseId, req.body);
    res.sendStatus(200);
  };

  const enrollUserInCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    await enrollmentsDao.enrollUserInCourse(currentUser._id, req.params.courseId);
    res.sendStatus(200);
  };

  const unenrollUserFromCourse = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    await enrollmentsDao.unenrollUserFromCourse(currentUser._id, req.params.courseId);
    res.sendStatus(200);
  };

  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    const users = await enrollmentsDao.findUsersForCourse(cid);
    res.json(users);
  };

  app.get("/api/users/current/enrollments", findMyEnrollments);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/courses", findAllCourses);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.post("/api/courses/:courseId/enroll", enrollUserInCourse);
  app.delete("/api/courses/:courseId/enroll", unenrollUserFromCourse);
  app.get("/api/courses/:cid/users", findUsersForCourse);
}