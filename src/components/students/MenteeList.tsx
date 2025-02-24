import React, { useEffect, useState } from "react";
import MentorBarGraph from "@/components/mentor-charts/MentorBarGraph";

interface Mentee {
  name: string;
  email: string;
  roll_no: string;
  dept: string;
  mentor_name: string;
}

interface Assignment {
  id: string;
  title: string;
  due_date: string;
  course_id: string;
  email: string;
  [key: string]: string;
}

interface GroupedMentors {
  [key: string]: {
    mentees: Mentee[];
    assignments: Assignment[];
  };
}

interface MenteeListProps {
  selectedMentor?: string;
}

const MenteeList: React.FC<MenteeListProps> = ({ selectedMentor = "all" }) => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menteeResponse, assignmentResponse] = await Promise.all([
          fetch("http://localhost:3001/api/mentormentee", { 
            method: "GET", 
            credentials: "include" 
          }),
          fetch("http://localhost:3001/api/menteeAssignment", { 
            method: "GET", 
            credentials: "include" 
          })
        ]);

        if (!menteeResponse.ok || !assignmentResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const [menteeData, assignmentData] = await Promise.all([
          menteeResponse.json(),
          assignmentResponse.json()
        ]);

        setMentees(menteeData);
        setAssignments(assignmentData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedMentors = mentees.reduce((acc: GroupedMentors, mentee) => {
    if (!acc[mentee.mentor_name]) {
      acc[mentee.mentor_name] = { mentees: [], assignments: [] };
    }
    acc[mentee.mentor_name].mentees.push(mentee);
    return acc;
  }, {});

  assignments.forEach(assignment => {
    const mentee = mentees.find(m => m.email === assignment.email);
    if (mentee && groupedMentors[mentee.mentor_name]) {
      groupedMentors[mentee.mentor_name].assignments.push(assignment);
    }
  });

  // Get unique mentor names
  const mentorNames = Object.keys(groupedMentors);

  // Filter displayed mentors based on selection
  const displayedMentors = selectedMentor === "all"
    ? mentorNames
    : [selectedMentor].filter(name => mentorNames.includes(name)); // Only include if mentor exists

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-gray-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mr-2"></div>
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mentor Assignment Progress</h1>
        </div>
        
        <div className="space-y-6">
          {displayedMentors.map(mentorName => (
            <MentorBarGraph
              key={mentorName}
              mentorName={mentorName}
              mentees={groupedMentors[mentorName].mentees}
              assignments={groupedMentors[mentorName].assignments}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenteeList;