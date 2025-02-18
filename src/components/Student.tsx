import React, { useEffect, useState } from "react";
import { fetchStudents } from "@/utils/api";

interface ExamRegisteredProps {
  courseID: string;
  dept: string;
}

const Student: React.FC<ExamRegisteredProps> = (props) => {
  const [studentCount, setStudentCount] = useState<number>(0);

  useEffect(() => {
    const getRegisteredStudents = async () => {
      try {
        const { data: registeredStudents } = await fetchStudents();
        if(props.courseID && props.dept){
          const filteredStudents = registeredStudents.filter(
            (student: any) => student.course_id === props.courseID && student.dept === props.dept
          );
          setStudentCount(filteredStudents.length);
        }else if(props.courseID && !props.dept){
            const filteredStudents = registeredStudents.filter(
                (student: any) => student.course_id === props.courseID
            );
            setStudentCount(filteredStudents.length);
        }else if(!props.courseID && props.dept){
            const filteredStudents = registeredStudents.filter(
                (student: any) => student.dept === props.dept
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
      Students Count:
      <h2 className="text-6xl m-2">{studentCount}</h2>
    </div>
  );
};

export default Student;
