"use client";

import React, { useEffect, useState } from "react";
import MentorBarGraph from "../components/MentorBarGraph"; // Updated import
import { useRouter } from 'next/navigation';

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
  [key: string]: string; // Dynamic keys for weekly assignments
}

interface GroupedMentors {
  [key: string]: {
    mentees: Mentee[];
    assignments: Assignment[];
  };
}

const MenteeList: React.FC = () => {
 
  const router = useRouter();

  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {3
    const fetchMenteesAndAssignments = async () => {
      try {
        const menteeResponse = await fetch("http://localhost:3001/api/mentormentee", { method: "GET", credentials: "include" });
        if (!menteeResponse.ok) throw new Error("Failed to fetch mentees");
        setMentees(await menteeResponse.json());

        const assignmentResponse = await fetch("http://localhost:3001/api/menteeAssignment", { method: "GET", credentials: "include" });
        if (!assignmentResponse.ok) throw new Error("Failed to fetch assignments");
        setAssignments(await assignmentResponse.json());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenteesAndAssignments();
  }, []);

  const groupedMentors: GroupedMentors = mentees.reduce((acc: GroupedMentors, mentee) => {
    if (!acc[mentee.mentor_name]) acc[mentee.mentor_name] = { mentees: [], assignments: [] };
    acc[mentee.mentor_name].mentees.push(mentee);
    return acc;
  }, {});

  assignments.forEach((assignment) => {
    mentees.forEach((mentee) => {
      if (mentee.email === assignment.email) {
        if (groupedMentors[mentee.mentor_name]) {
          groupedMentors[mentee.mentor_name].assignments.push(assignment);
        }
      }
    });
  });

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-xl text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-800">Mentor Assignment Progress</h1>
      <button 
        className="px-4 py-2 text-white rounded-lg bg-[#990011] hover:bg-[#77000e] transition-colors duration-200 shadow-md"
        onClick={() => router.push('/dashboard')}
      >
        Dashboard
      </button>
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedMentors).map(([mentorName, { mentees, assignments }]) => (
          <MentorBarGraph key={mentorName} mentorName={mentorName} mentees={mentees} assignments={assignments} />
        ))}
      </div>
    </div>
  );
};

export default MenteeList;
