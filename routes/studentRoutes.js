import express from "express";
import validate from "../middlewares/validationMiddleware.js";
import * as studentValidation from "../validations/studentValidation.js";
import studentController from "../controllers/studentController.js";

const router = express.Router();

router.post(
  "/",
  validate(studentValidation.createStudent),
  studentController.createStudent
);
router.get(
  "/",
  validate(studentValidation.listStudentsQuery, "query"), 
  studentController.getAllStudents
);
router.get(
  "/:id",
  validate(studentValidation.studentIdParam),
  studentController.getStudent
);
router.get(
  "/class/:classId/marks",
  validate(studentValidation.classIdParam, "params"), 
  studentController.getClassStudentsWithMarks
);
router.patch(
  "/:id",
  validate(studentValidation.updateStudent),
  studentController.updateStudent
);
router.delete(
  "/:id",
  validate(studentValidation.studentIdParam),
  studentController.deleteStudent
);

export default router;
