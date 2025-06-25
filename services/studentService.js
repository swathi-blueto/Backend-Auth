import studentRepo from "../repositories/studentRepository.js";

export const createStudent = async (data) => {
  if (!data.admissionNumber) {
    data.admissionNumber = await studentRepo.generateAdmissionNumber(
      data.schoolId
    );
  }

  const existingStudent = await studentRepo.findStudentByNameAndNumber(
    data.name,
    data.admissionNumber
  );

  if (existingStudent) {
    throw new Error(
      "Student with this name and admission number combination already exists"
    );
  }

  return studentRepo.createStudentRecord(data);
};

export const getStudentById = async (id) => {
  const student = await studentRepo.findStudentById(id);
  if (!student) throw new Error("Student not found");
  return student;
};

export const getAllStudents = async ({ page, limit, ...filters }) => {
  return studentRepo.findAllStudents({
    filters,
    pagination: {
      skip: (page - 1) * limit,
      take: limit,
    },
  });
};

export const updateStudent = async (id, updateData) => {
  await getStudentById(id);

  if (updateData.admissionNumber || updateData.name) {
    const current = await getStudentById(id);
    const admissionNumber =
      updateData.admissionNumber || current.admissionNumber;
    const name = updateData.name || current.name;

    const existing = await studentRepo.findStudentByNameAndNumber(
      name,
      admissionNumber
    );
    if (existing && existing.id !== id) {
      throw new Error(
        "Another student already has this name and admission number combination"
      );
    }
  }

  return studentRepo.updateStudentRecord(id, updateData);
};

export const deleteStudent = async (id) => {
  await getStudentById(id);
  return studentRepo.deleteStudentRecord(id);
};

export const getStudentsWithMarks = async (classId) => {
  return studentRepo.findStudentsWithMarks({ class: classId });
};


export const searchStudents = async (filters, pagination) => {
  return studentRepo.searchStudents(filters, pagination);
};


export const getStudentsByClassAndSection = async (className, section) => {
  const students = await studentRepo.findStudentsByClassAndSection(className, section);
  
  if (students.length === 0) {
    throw new Error(`No students found in Class ${className}-${section}`);
  }
  
  return students;
};