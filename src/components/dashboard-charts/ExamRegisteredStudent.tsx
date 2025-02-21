import React, { useEffect, useState } from "react";
import { fetchStudentsRegistered } from "@/utils/api";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface ExamRegisteredProps {
  courseID: string;
  dept: string;
}

const ExamRegistered: React.FC<ExamRegisteredProps> = (props) => {
  const [examRegisteredCount, setExamRegisteredCount] = useState<number>(0);
  const [courseEnrolled, setCourseEnrolled] = useState<number>(0);

  useEffect(() => {
    const getRegisteredStudents = async () => {
      try {
        const { data: registeredStudents } = await fetchStudentsRegistered(props.dept);
        const { data: courseRegistered } = await fetchStudentsRegistered(props.dept);
        if(props.courseID){
          const filteredStudents = registeredStudents.filter(
            (student: any) => student.course_id === props.courseID && student.status === "payment_complete"
          );
          const filteredCourse = courseRegistered.filter(
            (student: any) => student.course_id === props.courseID
          );
          setCourseEnrolled(filteredCourse.length);
          setExamRegisteredCount(filteredStudents.length);
        }else{
          setCourseEnrolled(courseRegistered.length);
          setExamRegisteredCount(registeredStudents.length);
        }
      } catch (error) {
        console.error("Failed to fetch students", error);
      }
    };

    getRegisteredStudents();
  }, [props.dept, props.courseID]);

  const data = {
    labels: ['Registered', 'Not Registered'],
    datasets: [
      {
        data: [examRegisteredCount, courseEnrolled - examRegisteredCount],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',  // Teal for registered
          'rgba(234, 236, 239, 0.8)'   // Light gray for not registered
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(234, 236, 239, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = courseEnrolled;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const registrationPercentage = ((examRegisteredCount / courseEnrolled) * 100).toFixed(1);

  return (
    <div className="">
      <h2 className="font-semibold text-center text-black mb-4">Exam Registration Status</h2>
      <div className="relative w-full max-w-xs mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-800">
            {examRegisteredCount}
          </div>
          <div className="text-sm text-gray-500">
            of {courseEnrolled} students
          </div>
          <div className="text-lg font-semibold text-gray-600">
            {registrationPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamRegistered;