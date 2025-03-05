'use client';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,   
  ChartOptions,
  TooltipItem
} from 'chart.js';
import { fetchAssignments } from '@/utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface AssignmentsGraph {
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

const BarGraph: React.FC<AssignmentsGraph> = (props) => {
  const [chartData, setChartData] = useState<any>(null);
  const [assignments, setAssignments] = useState<AssignmentData[]>([]);

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Weekly Assignment Completion',
      },
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            if (context.dataset.label === 'Not Completed') {
              return `Not Completed: ${context.raw}`;
            } else {
              return `Completed: ${context.raw}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Weeks'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Number of Students'
        }
      }
    }
  };

  useEffect(() => {
    const getAssignments = async () => {
      try {
        const { data: assignments } = await fetchAssignments(props.dept, props.courseId);
        setAssignments(assignments);
        var filteredAssignments = assignments;
        if(props.dept && props.courseId){
          filteredAssignments = assignments.filter(
            (assignment: any) => assignment.dept === props.dept && assignment.courseid === props.courseId
          );
        }else if(props.dept && !props.courseId){
          filteredAssignments = assignments.filter(
            (assignment: any) => assignment.dept === props.dept
          );
        }else if(!props.dept && props.courseId){
          filteredAssignments = assignments.filter(
            (assignment: any) => assignment.courseid === props.courseId
          );
        }else{
          filteredAssignments = assignments;
        }
        console.log(filteredAssignments);
        // Calculate completed and not completed for each week
        const completed: number[] = [];
        const notCompleted: number[] = [];
        const iteration = Math.max(...filteredAssignments.map((assignment: any) => {
          const assignmentKeys = Object.keys(assignment).filter(key => key.startsWith('assignment'));
            return assignmentKeys.findIndex(key => assignment[key] === '-1.00');
        }));
        
        for (let i = 0; i <= iteration; i++) {
          const weekLabel = `assignment${i}`;
          
          const completedCount = filteredAssignments.filter(
            (assignment: any) => parseFloat(assignment[weekLabel]) > 0 || assignment[weekLabel] === -1
          ).length;
          
          const notCompletedCount = filteredAssignments.length - completedCount;

          completed.push(completedCount);
          notCompleted.push(notCompletedCount);
        }

        // Set data for the bar chart
        setChartData({
          labels: Array.from({ length: iteration }, (_, i) => `Week ${i}`),
          datasets: [
            {
              label: 'Completed',
              data: completed,
              backgroundColor: 'rgba(255, 99, 0, 0.5)',
            },
            {
              label: 'Not Completed',
              data: notCompleted,
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch assignments', error);
      }
    };

    getAssignments();
  }, [props.dept,props.courseId]);

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading data...</p>}
    </div>
  );
};

export default BarGraph;
