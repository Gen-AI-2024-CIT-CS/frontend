import React, { useEffect, useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { fetchStudentsRegistered, fetchAssignments } from "@/utils/api";

interface StudentEngagementTrackerProps {
  dept: string;
  courseId: string;
}

const StudentEngagementTracker = ({ dept, courseId }: StudentEngagementTrackerProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [engagementData, setEngagementData] = useState([
    { metric: 'Course Enrollment', value: 0, fullMark: 100 },
    { metric: 'Exam Reg', value: 0, fullMark: 100 },
    { metric: 'Assignment', value: 0, fullMark: 100 }
  ]);

  useEffect(() => {
    const fetchAllMetrics = async () => {
      try {
        setLoading(true);

        // 1. Fetch course enrollment data
        const { data: registeredStudents } = await fetchStudentsRegistered(dept);
        let totalStudents = 0;
        let enrolledStudents = 0;

        // Filter students based on department and course ID (similar to RegisteredStudents component)
        if (courseId && dept) {
          const filteredStudents = registeredStudents.filter(
            (student: any) => student.course_id === courseId && student.dept === dept
          );
          totalStudents = filteredStudents.length;
          enrolledStudents = filteredStudents.length;
        } else if (courseId && !dept) {
          const filteredStudents = registeredStudents.filter(
            (student: any) => student.course_id === courseId
          );
          totalStudents = filteredStudents.length;
          enrolledStudents = filteredStudents.length;
        } else if (!courseId && dept) {
          const filteredStudents = registeredStudents.filter(
            (student: any) => student.dept === dept
          );
          totalStudents = filteredStudents.length;
          enrolledStudents = filteredStudents.length;
        } else {
          totalStudents = registeredStudents.length;
          enrolledStudents = registeredStudents.length;
        }

        // 2. Fetch exam registration data (similar to ExamRegistered component)
        let examRegisteredCount = 0;
        if (courseId) {
          const filteredExamStudents = registeredStudents.filter(
            (student: any) => student.course_id === courseId && student.status === "payment_complete"
          );
          examRegisteredCount = filteredExamStudents.length;
        } else {
          // Default case
          examRegisteredCount = registeredStudents.filter(
            (student: any) => student.status === "payment_complete"
          ).length;
        }
        
        // 3. Fetch assignment data (similar to AverageAssignment component)
        const { data: assignments } = await fetchAssignments(dept, courseId);
        let filteredAssignments = assignments;
        
        if (dept && courseId) {
          filteredAssignments = assignments.filter(
            (assignment: any) => assignment.dept === dept && assignment.courseid === courseId
          );
        } else if (dept && !courseId) {
          filteredAssignments = assignments.filter(
            (assignment: any) => assignment.dept === dept
          );
        } else if (!dept && courseId) {
          filteredAssignments = assignments.filter(
            (assignment: any) => assignment.courseid === courseId
          );
        }
        
        // Calculate average score (using the same method as AverageAssignment)
        const averageScore = calculateAverageScore(filteredAssignments);
        
        // Calculate enrollment percentage
        const enrollmentPercentage = totalStudents > 0 ? (enrolledStudents / totalStudents) * 100 : 0;
        
        // Calculate exam registration percentage
        const examRegistrationPercentage = enrolledStudents > 0 ? (examRegisteredCount / enrolledStudents) * 100 : 0;
        

        // Set all metrics for radar chart
        setEngagementData([
          { metric: 'Course Enrollment', value: Math.round(enrollmentPercentage), fullMark: 100 },
          { metric: 'Exam Reg', value: Math.round(examRegistrationPercentage), fullMark: 100 },
          { metric: 'Score', value: Math.round(averageScore), fullMark: 100 }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch engagement metrics:", error);
        
        // Set fallback data in case of error
        setEngagementData([
          { metric: 'Course Enrollment', value: 0, fullMark: 100 },
          { metric: 'Exam Registration', value: 0, fullMark: 100 },
          { metric: 'Assignment Score', value: 0, fullMark: 100 }
        ]);
        
        setLoading(false);
      }
    };

    fetchAllMetrics();
  }, [dept, courseId]);

  // Helper function to calculate average assignment score
  const calculateAverageScore = (assignments: any[]) => {
    const totalAssignments = assignments.length;
    if (totalAssignments === 0) return 0;

    const totalSum = assignments.reduce((sum, assignment) => {
      const assignmentValues = Object.keys(assignment)
        .filter(key => key.startsWith('assignment'))
        .map(key => parseFloat(assignment[key]))
        .filter(value => !isNaN(value));
      const validAssignmentValues = assignmentValues.filter(value => value > 0);
      if (validAssignmentValues.length === 0) return sum;
      const assignmentAverage = validAssignmentValues.reduce((a, b) => a + b, 0) / validAssignmentValues.length;
      return sum + assignmentAverage;
    }, 0);

    return totalSum / totalAssignments;
  };

  return (
    <div className="">
      <h2 className="font-semibold text-center mb-4 text-black">
        Student Engagement Metrics
      </h2>
      <div className="relative w-full max-w-xs mx-auto h-[15rem]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={engagementData}>
              <PolarGrid strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: '#374151', fontSize: 10 }} />
              <PolarRadiusAxis angle={45} domain={[0, 100]} />
              <Radar
              name="Performance"
              dataKey="value"
              stroke="#69c6c6"
              fill="#69c6c6"
              fillOpacity={0.5}
              />
              <Tooltip 
              formatter={(value) => [`${value}%`, 'Score']}
              contentStyle={{ 
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px'
              }}
              />
              <Legend 
              wrapperStyle={{ fontSize: 12, bottom: 10 }}
              formatter={(value) => <span style={{ color: "#374151" }}>{value}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default StudentEngagementTracker;