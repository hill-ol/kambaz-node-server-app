import AssignmentsDao from "./dao.js";

export default function AssignmentsRoutes(app, db) {
  const dao = AssignmentsDao(db);

  const findAssignmentsForCourse = async (req, res) => {
    const assignments = await dao.findAssignmentsForCourse(req.params.courseId);
    res.json(assignments);
  };

  const createAssignmentForCourse = async (req, res) => {
    const { courseId } = req.params;
    const newAssignment = await dao.createAssignment({ ...req.body, course: courseId });
    res.json(newAssignment);
  };

  const deleteAssignment = async (req, res) => {
    await dao.deleteAssignment(req.params.assignmentId);
    res.sendStatus(200);
  };

  const updateAssignment = async (req, res) => {
    await dao.updateAssignment(req.params.assignmentId, req.body);
    res.sendStatus(200);
  };

  app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
  app.post("/api/courses/:courseId/assignments", createAssignmentForCourse);
  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}