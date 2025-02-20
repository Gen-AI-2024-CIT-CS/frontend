import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Types
interface Mentee {
  name: string;
  roll_no: string;
  dept: string;
  email: string;
}

interface Assignment {
  email: string;
  [key: string]: string;
}

interface MentorBarGraphProps {
  mentorName: string;
  mentees: Mentee[];
  assignments: Assignment[];
}

interface StudentStats {
  completed: number;
  notCompleted: number;
}

const DEPARTMENT_MAP: Record<string, string> = {
  'AM': 'AIML',
  'CS': 'CSE',
  'CZ': 'CSE (CS)',
};

const chartOptions: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: { display: true, text: "Mentor-wise Assignment Completion" },
  },
  scales: {
    x: { title: { display: true, text: "Weeks" } },
    y: { title: { display: true, text: "Number of Assignments Completed" } },
  },
};

const MentorBarGraph: React.FC<MentorBarGraphProps> = ({ mentorName, mentees, assignments }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [selectedMenteeIndex, setSelectedMenteeIndex] = useState<number | null>(null);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);

  const getDepartmentFromRollNo = (rollNo: string): string => {
    const deptCode = rollNo.match(/\d{2}([A-Z]{2})/)?.[1] || "";
    return DEPARTMENT_MAP[deptCode] || deptCode;
  };

  const getRollNumberValue = (roll: string) => {
    const match = roll.match(/(\d{2})(?:[A-Z]{2})(\d+)/);
    return match ? { 
      year: parseInt(match[1]), 
      sequence: parseInt(match[2]) 
    } : { 
      year: 0, 
      sequence: 0 
    };
  };

  const sortedMentees = [...mentees].sort((a, b) => {
    const aValues = getRollNumberValue(a.roll_no);
    const bValues = getRollNumberValue(b.roll_no);
    return aValues.year !== bValues.year 
      ? aValues.year - bValues.year 
      : aValues.sequence - bValues.sequence;
  });

  useEffect(() => {
    const processAssignments = () => {
      const menteeEmails = new Set(mentees.map(m => m.email));
      const mentorAssignments = assignments.filter(a => menteeEmails.has(a.email));

      const weeklyStats = Array.from({ length: 12 }, (_, i) => {
        const weekLabel = `assignment${i + 1}`;
        const completedCount = mentorAssignments.filter(a => parseFloat(a[weekLabel]) > 0).length;
        return {
          completed: completedCount,
          notCompleted: mentorAssignments.length - completedCount
        };
      });

      setChartData({
        labels: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
        datasets: [
          {
            label: "Completed",
            data: weeklyStats.map(stat => stat.completed),
            backgroundColor: 'rgba(255, 99, 0, 0.5)',
          },
          {
            label: "Not Completed",
            data: weeklyStats.map(stat => stat.notCompleted),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          }
        ]
      });
    };

    processAssignments();
  }, [mentees, assignments]);

  const handleMenteeClick = (mentee: Mentee, index: number) => {
    const studentAssignments = assignments.filter(a => a.email === mentee.email);
    const completedCount = Array.from({ length: 12 }, (_, i) => 
      studentAssignments.some(a => parseFloat(a[`assignment${i + 1}`]) > 0)
    ).filter(Boolean).length;

    setSelectedMentee(mentee);
    setStudentStats({ completed: completedCount, notCompleted: 12 - completedCount });
    setSelectedMenteeIndex(index);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-4">{mentorName}</h3>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Graph Section - Takes 60% width on larger screens */}
        <div className="lg:w-3/5">
          <div className="h-[400px]"> {/* Fixed height for the graph */}
            {chartData ? (
              <Bar 
                data={chartData} 
                options={{
                  ...chartOptions,
                  maintainAspectRatio: false // Allows the chart to fill container
                }} 
              />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>

        {/* Students List Section - Takes 40% width on larger screens */}
        <div className="lg:w-3/5">
          <h4 className="text-md font-semibold text-gray-700 mb-2">Students:</h4>
          <div className="max-h-[400px] overflow-y-auto"> {/* Scrollable container */}
            <ul className="space-y-3">
              {sortedMentees.map((mentee, index) => (
                <React.Fragment key={mentee.email}>
                  <li
                    className={`p-3 border rounded-md flex justify-between items-center hover:bg-gray-100 cursor-pointer transition
                      ${selectedMenteeIndex === index ? "bg-blue-100 border-blue-400" : "bg-gray-50"}`}
                    onClick={() => handleMenteeClick(mentee, index)}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{mentee.name}</p>
                      <p className="text-sm text-gray-600">
                        Roll No: {mentee.roll_no} | {getDepartmentFromRollNo(mentee.roll_no)}
                      </p>
                    </div>
                    <span className="text-blue-500 font-semibold text-sm">View Progress</span>
                  </li>

                  {selectedMenteeIndex === index && studentStats && (
                    <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="text-lg font-bold text-blue-800">{selectedMentee?.name}'s Progress</h4>
                      <p className="text-md text-gray-700">
                        Completed Weeks: <span className="font-semibold text-green-600">{studentStats.completed}</span>
                      </p>
                      <p className="text-md text-gray-700">
                        Not Completed Weeks: <span className="font-semibold text-red-600">{studentStats.notCompleted}</span>
                      </p>
                      
                      <div className="mt-3 flex space-x-2">
                        <button 
                          onClick={() => setSelectedMenteeIndex(null)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
                        >
                          Close
                        </button>
                        
                        <button
                          onClick={() => {
                            const nextIndex = (selectedMenteeIndex + 1) % sortedMentees.length;
                            handleMenteeClick(sortedMentees[nextIndex], nextIndex);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MentorBarGraph;