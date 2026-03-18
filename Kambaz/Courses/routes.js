import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
  const dao = CoursesDao(db);
  const enrollmentsDao = EnrollmentsDao(db);

  const findAllCourses = (req, res) => {
    res.json(dao.findAllCourses());
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) { res.sendStatus(401); return; }
      userId = currentUser._id;
    }
    const courses = dao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const findMyEnrollments = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const myEnrollments = db.enrollments.filter((e) => e.user === currentUser._id);
    res.json(myEnrollments);
  };

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    const newCourse = dao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourse = (req, res) => {
    dao.deleteCourse(req.params.courseId);
    res.sendStatus(200);
  };

  const updateCourse = (req, res) => {
    const { courseId } = req.params;
    const updated = dao.updateCourse(courseId, req.body);
    res.json(updated);
  };

  const enrollUserInCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    enrollmentsDao.enrollUserInCourse(currentUser._id, req.params.courseId);
    res.sendStatus(200);
  };

  const unenrollUserFromCourse = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) { res.sendStatus(401); return; }
    enrollmentsDao.unenrollUserFromCourse(currentUser._id, req.params.courseId);
    res.sendStatus(200);
  };

  // specific routes BEFORE parameterized routes
  app.get("/api/users/current/enrollments", findMyEnrollments);
  app.post("/api/users/current/courses", createCourse);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.get("/api/courses", findAllCourses);
  app.delete("/api/courses/:courseId", deleteCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.post("/api/courses/:courseId/enroll", enrollUserInCourse);
  app.delete("/api/courses/:courseId/enroll", unenrollUserFromCourse);
}