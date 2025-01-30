import React, { useEffect, useState } from "react";
import { fetchStudentsRegistered } from "@/utils/api";

const RegisteredStudents: React.FC = () => {
  const [studentCount, setStudentCount] = useState<number>(0);
  const courseId = "ns_noc24_cs114"; 
  const dept = "Artificial Intelligence and Machine Learning"

  useEffect(() => {
    const getRegisteredStudents = async () => {
      try {
        const { data: registeredStudents } = await fetchStudentsRegistered(courseId,dept);
        console.log(registeredStudents)
        const filteredStudents = registeredStudents.filter(
          (student: any) => student.course_id === courseId
        );

        setStudentCount(filteredStudents.length);
      } catch (error) {
        console.error("Failed to fetch students", error);
      }
    };

    getRegisteredStudents();
  }, []);

  return (
    <div>
      Total Registered:
      <h2 className="text-6xl m-2">{studentCount}</h2>
    </div>
  );
};

export default RegisteredStudents;
