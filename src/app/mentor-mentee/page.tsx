"use client"

import React, { useEffect, useState } from 'react';

interface Mentee {
  name: string;
  email: string;
  roll_no: string;
  mentor_name: string;
}

interface GroupedMentees {
  [key: string]: Mentee[];
}

const MenteeList: React.FC = () => {
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/mentormentee", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error('Failed to fetch mentees');
        }
        const data = await response.json();
        setMentees(data);
      } catch (error) {
        console.error("Error fetching mentees:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  // Group mentees by mentor
  const groupedMentees: GroupedMentees = mentees.reduce((acc: GroupedMentees, mentee) => {
    const mentorName = mentee.mentor_name;
    if (!acc[mentorName]) {
      acc[mentorName] = [];
    }
    acc[mentorName].push(mentee);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Mentee List
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {Object.entries(groupedMentees).map(([mentorName, menteeGroup]) => (
          <div 
            key={mentorName} 
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:shadow-lg"
          >
            <div className="bg-blue-50 p-4 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-blue-800 mb-1">
                Mentor: {mentorName}
              </h2>
              <p className="text-sm text-gray-600">
                {menteeGroup.length} Mentee{menteeGroup.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="p-4">
              {menteeGroup.map((mentee, index) => (
                <div 
                  key={index}
                  className={`py-3 ${
                    index !== menteeGroup.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="font-medium text-gray-800 mb-1">
                    {mentee.name}
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    {mentee.email}
                  </div>
                  <div className="text-sm text-gray-500">
                    Roll: {mentee.roll_no}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenteeList;