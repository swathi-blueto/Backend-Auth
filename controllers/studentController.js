import * as studentService from "../services/studentService.js";


const createStudent = async (req, res) => {
  try {
    if (req.body.dob) {
      req.body.dob = new Date(req.body.dob).toISOString().split('T')[0];
    }
    
    const student = await studentService.createStudent(req.body);
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student
    });
  } catch (err) {
    const statusCode = err.message.includes('already exists') ? 409 : 400;
    res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { data, total } = await studentService.getAllStudents({
      ...req.query,
      page: parseInt(page),
      limit: parseInt(limit),
    });

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const searchStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const { data, total } = await studentService.searchStudents(
      filters, 
      { page: parseInt(page), limit: parseInt(limit) }
    );

    res.status(200).json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await studentService.updateStudent(req.params.id, req.body);
    res.status(200).json({ 
      success: true, 
      message: "Student updated", 
      data: student 
    });
  } catch (err) {
    const statusCode = err.message.includes('already exists') ? 409 : 404;
    res.status(statusCode).json({ 
      success: false, 
      message: err.message 
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    await studentService.deleteStudent(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getClassStudentsWithMarks = async (req, res) => {
  try {
    const students = await studentService.getStudentsWithMarks(req.params.classId);
    res.status(200).json({ success: true, data: students });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getStudentsByClassAndSection = async (req, res) => {
  try {
    const students = await studentService.getStudentsByClassAndSection(
      req.params.class,
      req.params.section
    );
    res.status(200).json({ 
      success: true, 
      data: students 
    });
  } catch (err) {
    res.status(404).json({ 
      success: false, 
      message: err.message 
    });
  }
};

export default {
  getClassStudentsWithMarks,
  deleteStudent,
  updateStudent,
  getAllStudents,
  getStudent,
  createStudent,
  searchStudents,
  getStudentsByClassAndSection
};