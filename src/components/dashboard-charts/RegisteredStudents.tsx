import React, { useEffect, useState } from "react";
import { fetchStudentsRegistered,fetchStudents } from "@/utils/api";
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

const RegisteredStudents: React.FC<ExamRegisteredProps> = (props) => {
  const [registeredCount, setRegisteredCount] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);

  useEffect(() => {
    const getRegisteredStudents = async () => {
      try {
        const { data: registeredStudents } = await fetchStudentsRegistered(props.dept);
        const { data: students } = await fetchStudents();
        if(props.courseID && props.dept){
          const filteredStudents = registeredStudents.filter(
            (student: any) => student.course_id === props.courseID && student.dept === props.dept
          );
          setTotalStudents(filteredStudents.length);
          console.log(filteredStudents);
        }else if(props.courseID && !props.dept){
            const filteredStudents = registeredStudents.filter(
                (student: any) => student.course_id === props.courseID
            );
            setTotalStudents(filteredStudents.length);
        }else if(!props.courseID && props.dept){
            const filteredStudents = registeredStudents.filter(
                (student: any) => student.dept === props.dept
            );
            setTotalStudents(filteredStudents.length);
        }else{
          setTotalStudents(registeredStudents.length);
        }
        if(props.courseID){
          const filteredStudents = registeredStudents.filter(
            (student: any) => student.course_id === props.courseID
          );
          setRegisteredCount(filteredStudents.length);
        }else{
          setRegisteredCount(registeredStudents.length);
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
        data: [registeredCount, totalStudents - registeredCount],
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
            const total = totalStudents;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const registrationPercentage = ((registeredCount / totalStudents) * 100).toFixed(1);

  return (
    <div className="">
      <h2 className="font-semibold text-center mb-4 text-black">Course Enrollment Status</h2>
      <div className="relative w-full max-w-xs mx-auto">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-800">
            {registeredCount}
          </div>
          <div className="text-sm text-gray-500">
            of {totalStudents} students
          </div>
          <div className="text-lg font-semibold text-gray-600">
            {registrationPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisteredStudents;