package com.wipro.hostel.repository;

import com.wipro.hostel.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Integer> {

}