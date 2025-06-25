import Joi from "joi";
import { STUDENT_STATUS } from "../config/constants.js";

const commonMessages = {
  "any.required": "is required",
  "string.empty": "cannot be empty",
  "string.pattern.base": "contains invalid characters",
};

export const createStudent = Joi.object({
  admissionNumber: Joi.string()
    .optional()
    .pattern(/^[A-Za-z0-9-]+$/)
    .messages({
      "string.pattern.base":
        "Admission number must contain only letters, numbers and hyphens",
    }),

  name: Joi.string()
    .required()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z ]+$/)
    .messages({
      "string.pattern.base": "Name can only contain letters and spaces",
    }),

  dob: Joi.date().iso().required().raw().messages({
    "date.base": "Invalid date format (YYYY-MM-DD)",
    "any.required": "Date of birth is required",
  }),

  gender: Joi.string().valid("male", "female", "other").required(),

  class: Joi.string().required(),
  section: Joi.string().required(),

  bloodGroup: Joi.string().optional(),

  parentId: Joi.string().uuid().optional(),

  currentAcademicYear: Joi.string()
    .required()
    .pattern(/^\d{4}-\d{4}$/)
    .messages({
      "string.pattern.base": "Academic year must be in YYYY-YYYY format",
      "any.required": "Academic year is required",
    }),

  admissionDate: Joi.date()
    .iso()
    .default(() => new Date()),

  schoolId: Joi.string().uuid().optional(),
  photoUrl: Joi.string().optional(),
});

export const updateStudent = Joi.object({
  admissionNumber: Joi.string().optional(),
  name: Joi.string().optional(),
  dob: Joi.date().iso().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  class: Joi.string().optional(),
  section: Joi.string().optional(),
  bloodGroup: Joi.string().optional(),
  parentId: Joi.string().uuid().optional(),
  photoUrl: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(STUDENT_STATUS))
    .optional(),
}).min(1);

export const listStudentsQuery = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  class: Joi.string().optional(),
  section: Joi.string().optional(),
  admissionNumber: Joi.string().optional(),
  status: Joi.string()
    .valid(...Object.values(STUDENT_STATUS))
    .optional(),
}).with("page", "limit");

export const searchStudentsQuery = Joi.object({
  name: Joi.string().optional().min(2).max(100),
  class: Joi.string().optional(),
  section: Joi.string().optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
}).or("name", "class", "section");


export const classSectionParams = Joi.object({
  class: Joi.string().required(),
  section: Joi.string().required()
});

export const studentIdParam = Joi.object({
  id: Joi.string().uuid().required().messages({
    "string.guid": "Invalid student ID format",
  }),
});

export const classIdParam = Joi.object({
  classId: Joi.string().required(),
});
