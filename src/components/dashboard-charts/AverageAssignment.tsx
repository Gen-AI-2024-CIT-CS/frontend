import React from "react";
import {useState, useEffect} from "react";
import { fetchAssignments } from "@/utils/api";
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

interface AverageAssignmentProps {
    dept: string;
    courseId: string;
    year: string;
}

export default function AverageAssignment(props: AverageAssignmentProps) {
    const [average, setAverage] = useState<number>(0);
    
    const calculateAverage = (assignments: any[]) => {
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

    useEffect(() => {
        const getAssignments = async () => {
            try {
                const { data: assignments } = await fetchAssignments(props.dept, props.courseId);
                var filteredAssignments = assignments;
                // console.log(assignments)
                if(props.dept && props.courseId && props.year) {
                    filteredAssignments = assignments.filter(
                        (assignment: any) => 
                            assignment.dept === props.dept && 
                            assignment.courseid === props.courseId &&
                            assignment.year != null && assignment.year.toString() === props.year.toString()
                    );
                } else if(props.dept && props.courseId) {
                    filteredAssignments = assignments.filter(
                        (assignment: any) => 
                            assignment.dept === props.dept && 
                            assignment.courseid === props.courseId
                    );
                } else if(props.dept && props.year) {
                    filteredAssignments = assignments.filter(
                        (assignment: any) => 
                            assignment.dept === props.dept &&
                            assignment.year != null && assignment.year.toString() === props.year.toString()
                    );
                } else if(props.courseId && props.year) {
                    filteredAssignments = assignments.filter(
                        (assignment: any) => 
                            assignment.courseid === props.courseId &&
                            assignment.year != null && assignment.year.toString() === props.year.toString()
                    );
                } else if(props.dept) {
                    filteredAssignments = assignments.filter(
                        (assignment: any) => assignment.dept === props.dept
                    );
                } else if(props.courseId) {
                    filteredAssignments = assignments.filter(
                        (assignment: any) => assignment.courseid === props.courseId
                    );
                } else if(props.year) {
                    filteredAssignments = assignments.filter(
                        (assignment: any) => {
                            return assignment.year != null && assignment.year.toString() === props.year.toString();
                        }
                    );
                } else {
                    filteredAssignments = assignments;
                }
                
                const avg = calculateAverage(filteredAssignments);
                setAverage(avg);
            } catch (error) {
                console.error("Failed to fetch assignments", error);
            }
        };
        getAssignments();
    }, [props.dept, props.courseId, props.year]);

    const data = {
        labels: ['Score', 'Remaining'],
        datasets: [
            {
                data: [average, 100 - average],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.8)',  // Teal for score
                    'rgba(234, 236, 239, 0.8)'   // Light gray for remaining
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
                    pointStyle: 'circle',
                    font: {
                        size: 14
                    },
                    color: '#666666'
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const value = context.raw.toFixed(2);
                        return `${context.label}: ${value}%`;
                    }
                }
            }
        }
    };

    return (
        <div className="">
            <h2 className="font-semibold text-center mb-4 text-black">
                Average Assignment Score
            </h2>
            <div className="relative w-full max-w-xs mx-auto">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gray-800">
                        {average.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                        of 100 points
                    </div>
                    <div className="text-lg font-semibold text-gray-600">
                        {average.toFixed(1)}%
                    </div>
                </div>
            </div>
        </div>
    );
}