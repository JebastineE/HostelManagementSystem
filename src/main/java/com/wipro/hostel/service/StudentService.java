package com.wipro.hostel.service;

import com.wipro.hostel.entity.Student;
import com.wipro.hostel.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Integer studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException(
                        "Student with ID " + studentId + " not found"
                ));
    }

    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student updateStudent(Integer studentId, Student student) {

        Student existingStudent = getStudentById(studentId);

        existingStudent.setName(student.getName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setPhone(student.getPhone());
        existingStudent.setCourse(student.getCourse());
        existingStudent.setYear(student.getYear());

        return studentRepository.save(existingStudent);
    }

    public void deleteStudent(Integer studentId) {
        Student existingStudent = getStudentById(studentId);
        studentRepository.delete(existingStudent);
    }
}