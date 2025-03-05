import React from 'react';
import { useState, useEffect } from 'react';
import { fetchAssignments } from '@/utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StudentData {
  [key: string]: string;
}

interface CompletionTrendsChartProps {
  dept: string;
  courseId: string;
}

interface AssignmentData {
  [key: string]: string | null;
  course_id: string;
  courseid: string;
  created_at: string;
  dept: string;
  email: string;
  name: string;
  roll_no: string;
}

const CompletionTrendsChart: React.FC<CompletionTrendsChartProps> = (props) => {
  const [assignmentData, setAssignments] = useState<AssignmentData[]>([]);
  const [iteration, setIteration] = useState(0);

  useEffect(() => {
    const getAssignments = async () => {
      try {
        const { data: assignments } = await fetchAssignments(props.dept, props.courseId);
        var filteredAssignments = assignments;
        if (props.dept && props.courseId) {
          filteredAssignments = assignments.filter(
            (assignment: any) => assignment.dept === props.dept && assignment.courseid === props.courseId
          );
        } else if (props.dept && !props.courseId) {
          filteredAssignments = assignments.filter(
            (assignment: any) => assignment.dept === props.dept
          );
        } else if (!props.dept && props.courseId) {
          filteredAssignments = assignments.filter(
            (assignment: any) => assignment.courseid === props.courseId
          );
        } else {
          filteredAssignments = assignments;
        }
        setAssignments(filteredAssignments);

        const limit = Math.max(...filteredAssignments.map((assignment: any) => {
          const assignmentKeys = Object.keys(assignment).filter(key => key.startsWith('assignment'));
          return assignmentKeys.findIndex(key => assignment[key] === '-1.00');
        }));
        setIteration(limit);
      } catch (error) {
        console.error("Failed to fetch assignments", error);
      }
    };

    getAssignments();
  }, [props.courseId, props.dept]);

  const processData = () => {
    const assignmentCounts = Array(12).fill({ completed: 0, incomplete: 0 }).map(() => ({
      completed: 0,
      incomplete: 0
    }));

    assignmentData.forEach(student => {
      for (let i = 1; i <= iteration; i++) {
        const score = student[`assignment${i-1}`] ? parseFloat(student[`assignment${i-1}`] as string) : null;
        if (score === null) {
          assignmentCounts[i - 1].incomplete++;
          continue;
        }
        if (score > 0) {
          assignmentCounts[i - 1].completed++;
        } else {
          assignmentCounts[i - 1].incomplete++;
        }
      }
    });

    return assignmentCounts;
  };

  const assignmentCounts = iteration > 0 ? processData() : [];

  const chartData = {
    labels: iteration > 0 ? Array(iteration).fill(null).map((_, i) => `Week ${i}`) : [],
    datasets: iteration > 0 ? [
      {
        label: 'Completed',
        data: assignmentCounts.map(count => count.completed),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.3
      },
      {
        label: 'Not Completed',
        data: assignmentCounts.map(count => count.incomplete),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.3
      }
    ] : []
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Assignment Completion Trends'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Students'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Assignment Week'
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl p-4">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default CompletionTrendsChart;