import React, { useEffect, useState } from "react";
import { fetchStudentsRegistered } from "@/utils/api";
import { register } from "module";

interface ExamRegisteredProps {
  courseID: string;
  dept: string;
}

const RegisteredStudents: React.FC<ExamRegisteredProps> = (props) => {
  const [studentCount, setStudentCount] = useState<number>(0);

  useEffect(() => {
    const getRegisteredStudents = async () => {
      try {
        if(props.dept === "All Departments"){
          props.dept = "";
        }
        const { data: registeredStudents } = await fetchStudentsRegistered(props.dept);
        if(props.courseID){
          const filteredStudents = registeredStudents.filter(
            (student: any) => student.course_id === props.courseID
          );
          setStudentCount(filteredStudents.length);
        }else{
          setStudentCount(registeredStudents.length);
        }

      } catch (error) {
        console.error("Failed to fetch students", error);
      }
    };

    getRegisteredStudents();
  }, [props.dept,props.courseID]);

  return (
    <div>
      Total Registered:
      <h2 className="text-6xl m-2">{studentCount}</h2>
    </div>
  );
};

export default RegisteredStudents;
