import { v4 as uuidv4 } from "uuid";

export default function ModulesDao(db) {
  const findModulesForCourse = (courseId) =>
    db.modules.filter((m) => m.course === courseId);

  const createModule = (module) => {
    const newModule = { ...module, _id: uuidv4(), lessons: [] };
    db.modules = [...db.modules, newModule];
    return newModule;
  };

  const deleteModule = (moduleId) => {
    db.modules = db.modules.filter((m) => m._id !== moduleId);
  };

  const updateModule = (moduleId, moduleUpdates) => {
    const module = db.modules.find((m) => m._id === moduleId);
    if (!module) return null;
    Object.assign(module, moduleUpdates);
    return module;
  };

  return { findModulesForCourse, createModule, deleteModule, updateModule };
}