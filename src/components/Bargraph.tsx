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
  ChartOptions
} from 'chart.js';
import { fetchAssignments } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

const BarGraph: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const courseId = "ns_noc24_cs114"; 
  const dept = "Artificial Intelligence and Machine Learning";

  useEffect(() => {
    const getAssignments = async () => {
      try {
        const { data: assignments } = await fetchAssignments(courseId,dept);
        console.log(assignments)
        // Calculate completed and not completed for each week
        const completed: number[] = [];
        const notCompleted: number[] = [];

        for (let i = 1; i <= 12; i++) {
          const weekLabel = `assignment${i}`;
          
          const completedCount = assignments.filter(
            (assignment: any) => parseFloat(assignment[weekLabel]) > 0
          ).length;
          
          const notCompletedCount = assignments.length - completedCount;

          completed.push(completedCount);
          notCompleted.push(notCompletedCount);
        }

        // Set data for the bar chart
        setChartData({
          labels: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
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
  }, []);

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading data...</p>}
    </div>
  );
};

export default BarGraph;
