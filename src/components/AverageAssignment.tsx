import React from "react";
import {useState,useEffect} from "react";
import { fetchAssignments } from "../utils/api";

interface AverageAssignmentProps {
    dept: string;
    courseId: string;
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
                const avg = calculateAverage(filteredAssignments);
                setAverage(avg);
            } catch (error) {
                console.error("Failed to fetch assignments", error);
            }
        };
        getAssignments();
    }, [props.dept, props.courseId]);

    return (
        <div>
            <h3>Average Assignment Score: 
                <p className="text-6xl m-2">{average.toFixed(2)}</p>
            </h3>
        </div>
    );
}