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

const options: ChartOptions<"bar"> = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Mentor-wise Assignment Completion" },
  },
  scales: {
    x: { title: { display: true, text: "Weeks" } },
    y: { title: { display: true, text: "Number of Assignments Completed" } },
  },
};

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

const MentorBarGraph: React.FC<MentorBarGraphProps> = ({ mentorName, mentees, assignments }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [selectedMenteeIndex, setSelectedMenteeIndex] = useState<number | null>(null);
  const [studentStats, setStudentStats] = useState<{ completed: number; notCompleted: number } | null>(null);

  // Department mapping function
  const getDepartmentFromRollNo = (rollNo: string): string => {
    const deptCode = rollNo.match(/\d{2}([A-Z]{2})/)?.[1] || "";
    const deptMap: { [key: string]: string } = {
      'AM': 'AIML',
      'CS': 'CSE',
      'CZ': 'CSE (CS)',
      // Add more department mappings as needed
    };
    return deptMap[deptCode] || deptCode;
  };

  useEffect(() => {
    const processAssignments = () => {
      const menteeEmails = new Set(mentees.map((m) => m.email));
      const mentorAssignments = assignments.filter((a) => menteeEmails.has(a.email));

      const completed: number[] = [];
      const notCompleted: number[] = [];

      for (let i = 1; i <= 12; i++) {
        const weekLabel = `assignment${i}`;
        const completedCount = mentorAssignments.filter((a) => parseFloat(a[weekLabel]) > 0).length;
        completed.push(completedCount);
        notCompleted.push(mentorAssignments.length - completedCount);
      }

      setChartData({
        labels: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
        datasets: [
          { label: "Completed", data: completed, backgroundColor: "#4CAF50" },
          { label: "Not Completed", data: notCompleted, backgroundColor: "#FF5733" },
        ],
      });
    };

    processAssignments();
  }, [mentees, assignments]);

  const handleMenteeClick = (mentee: Mentee, index: number) => {
    const studentAssignments = assignments.filter((a) => a.email === mentee.email);
    let completedCount = 0;
  
    for (let i = 1; i <= 12; i++) {
      const weekLabel = `assignment${i}`;
      completedCount += studentAssignments.some((a) => parseFloat(a[weekLabel]) > 0) ? 1 : 0;
    }
  
    setSelectedMentee(mentee);
    setStudentStats({ completed: completedCount, notCompleted: 12 - completedCount });
    setSelectedMenteeIndex(index);
  };

  // Helper function to extract numeric part and year from roll number
  const getRollNumberValue = (roll: string) => {
    // Extract year and sequence number
    const match = roll.match(/(\d{2})(?:[A-Z]{2})(\d+)/);
    if (!match) return { year: 0, sequence: 0 };
    
    const year = parseInt(match[1]);
    const sequence = parseInt(match[2]);
    return { year, sequence };
  };

  // Sort mentees based on year first, then sequence number
  const sortedMentees = [...mentees].sort((a, b) => {
    const aValues = getRollNumberValue(a.roll_no);
    const bValues = getRollNumberValue(b.roll_no);
    
    // Sort by year first
    if (aValues.year !== bValues.year) {
      return aValues.year - bValues.year;
    }
    // Then by sequence number
    return aValues.sequence - bValues.sequence;
  });

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold text-center text-gray-800 mb-4">{mentorName}</h3>
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading...</p>}

      <h4 className="text-md font-semibold text-gray-700 mt-4 mb-2">Students:</h4>
      <ul className="space-y-3">
        {sortedMentees.map((mentee, index) => (
          <React.Fragment key={mentee.email}>
            <li
              className={`p-3 border rounded-md flex justify-between items-center hover:bg-gray-100 cursor-pointer transition ${
                selectedMenteeIndex === index ? "bg-blue-100 border-blue-400" : "bg-gray-50"
              }`}
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
                <p className="text-md text-gray-700">Completed Weeks: <span className="font-semibold text-green-600">{studentStats.completed}</span></p>
                <p className="text-md text-gray-700">Not Completed Weeks: <span className="font-semibold text-red-600">{studentStats.notCompleted}</span></p>
                
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
  );
};

export default MentorBarGraph;