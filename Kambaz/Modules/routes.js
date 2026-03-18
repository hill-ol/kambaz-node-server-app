import ModulesDao from "./dao.js";

export default function ModulesRoutes(app, db) {
  const dao = ModulesDao(db);

  const findModulesForCourse = (req, res) => {
    const { courseId } = req.params;
    res.json(dao.findModulesForCourse(courseId));
  };

  const createModuleForCourse = (req, res) => {
    const { courseId } = req.params;
    const newModule = dao.createModule({ ...req.body, course: courseId });
    res.json(newModule);
  };

  const deleteModule = (req, res) => {
    dao.deleteModule(req.params.moduleId);
    res.sendStatus(200);
  };

  const updateModule = (req, res) => {
    const { moduleId } = req.params;
    const updated = dao.updateModule(moduleId, req.body);
    res.json(updated);
  };

  app.get("/api/courses/:courseId/modules", findModulesForCourse);
  app.post("/api/courses/:courseId/modules", createModuleForCourse);
  app.delete("/api/modules/:moduleId", deleteModule);
  app.put("/api/modules/:moduleId", updateModule);
}