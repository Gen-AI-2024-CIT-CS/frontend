import React, { useEffect, useState, useMemo, useCallback } from "react";
import { fetchEnrollmentStats } from "@/utils/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip
);

interface EnrollmentBarChartProps {
  courseId?: string;
  dept?: string;
  year:string;
}

interface EnrollmentStats {
  course_id: string;
  course_name: string;
  enrollment_count: string;
}

const EnrollmentBarChart: React.FC<EnrollmentBarChartProps> = (props) => {
  const [allStats, setAllStats] = useState<EnrollmentStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState("enrollment");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageInputValue, setPageInputValue] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const coursesPerPage = 5;
  
  // Fetch data with debounce
  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      const getEnrollmentStats = async () => {
        setLoading(true);
        try {
          // Update to pass year parameter to fetchEnrollmentStats
          const data = await fetchEnrollmentStats(props.courseId, props.dept,props.year);
          console.log(data);
          if (isMounted) {
            setAllStats(Array.isArray(data) ? data : [data]);
            setError(null);
          }
        } catch (err) {
          console.error("Failed to fetch enrollment stats", err);
          if (isMounted) {
            setError("Failed to load enrollment statistics");
          }
        } finally {
          if (isMounted) {
            setLoading(false);
            setIsInitialLoad(false);
          }
        }
      };
  

      getEnrollmentStats();
    }, 300); // 300ms debounce

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [props.dept, props.courseId, props.year]);
  
  // Memoize sorted stats to prevent unnecessary recalculations
  const sortedStats = useMemo(() => {
    return [...allStats].sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" 
          ? a.course_name.localeCompare(b.course_name)
          : b.course_name.localeCompare(a.course_name);
      } else {
        return sortOrder === "asc"
          ? parseInt(a.enrollment_count) - parseInt(b.enrollment_count)
          : parseInt(b.enrollment_count) - parseInt(a.enrollment_count);
      }
    });
  }, [allStats, sortBy, sortOrder]);
  
  // Get current page of courses - memoized
  const currentCourses = useMemo(() => {
    return sortedStats.slice(
      currentPage * coursesPerPage, 
      (currentPage + 1) * coursesPerPage
    );
  }, [sortedStats, currentPage, coursesPerPage]);
  
  const totalPages = Math.ceil(allStats.length / coursesPerPage);
  
  // Memoize chart data to prevent unnecessary recreations
  const chartData = useMemo(() => ({
    labels: currentCourses.map(course => {
      const name = course.course_name;
      return name.length > 25 ? name.substring(0, 22) + '...' : name;
    }),
    datasets: [
      {
        label: 'Registered Students',
        data: currentCourses.map(course => parseInt(course.enrollment_count, 10)),
        backgroundColor: 'rgba(105, 198, 198, 1)',
        borderColor: 'rgba(105, 198, 198, 0.5)',
        borderWidth: 1,
      }
    ]
  }), [currentCourses]);
  
  const chartOptions = useMemo(() => ({
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0 }
      },
      y: {
        ticks: { 
          autoSkip: false,
          font: { size: 12 }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const index = tooltipItems[0].dataIndex;
            return currentCourses[index].course_name;
          },
          label: (context: any) => `Enrolled: ${context.raw} students`
        }
      }
    }
  }), [currentCourses]);
  
  // Pagination handlers - memoized with useCallback
  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);
  
  const prevPage = useCallback(() => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  }, [currentPage]);
  
  // Sorting handlers - memoized with useCallback
  const toggleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  }, [sortBy, sortOrder]);
  
  // Handle direct page navigation
  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputValue(e.target.value);
  };
  
  const goToPage = useCallback(() => {
    const pageNum = parseInt(pageInputValue, 10);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
      setCurrentPage(pageNum - 1);
      setPageInputValue("");
    }
  }, [pageInputValue, totalPages]);
  
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      goToPage();
    }
  }, [goToPage]);
  
  // Show skeleton loader during initial load
  if (isInitialLoad && loading) {
    return (
      <div className="p-6 rounded-lg shadow-md h-64">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-1/2 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-100 rounded w-1/4 mb-4 ml-auto"></div>
          <div className="space-y-3 h-40">
            <div className="h-4 bg-gray-100 rounded"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            <div className="h-4 bg-gray-100 rounded w-4/6"></div>
            <div className="h-4 bg-gray-100 rounded w-3/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg shadow-md flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (allStats.length === 0) {
    return (
      <div className="p-6 rounded-lg shadow-md flex justify-center items-center h-64">
        <div className="text-gray-500">No enrollment data available</div>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg shadow-md p-4">
      <h2 className="text-xl text-black font-semibold text-center mb-4">Course Enrollment</h2>
      
      {/* Sorting controls */}
      <div className="mb-4 flex justify-end text-sm">
        <span className="mr-2 mt-1 text-gray-800">Sort by:</span>
        <button 
          className={`mr-2 px-2 py-1 rounded ${sortBy === "name" ? "border-gray-500 border text-black hover:bg-[#c5c2c2]" : "text-gray-500 hover:border hover:border-black"}`}
          onClick={() => toggleSort("name")}
        >
          Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
        <button 
          className={`px-2 py-1 rounded ${sortBy === "enrollment" ? "border-gray-500 border text-black hover:bg-[#c5c2c2]" : "text-gray-500 hover:border hover:border-black"}`}
          onClick={() => toggleSort("enrollment")}
        >
          Enrollment {sortBy === "enrollment" && (sortOrder === "asc" ? "↑" : "↓")}
        </button>
      </div>
      
      {/* Chart with loading overlay */}
      <div className="h-64 mb-4 relative">
        {loading && !isInitialLoad && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
            <div className="text-[#69c6c6]">Updating data...</div>
          </div>
        )}
        <Bar data={chartData} options={chartOptions} />
      </div>
      
      {/* Enhanced pagination controls */}
      <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
        <div className="text-sm text-gray-600">
          Showing {currentPage * coursesPerPage + 1}-{Math.min((currentPage + 1) * coursesPerPage, allStats.length)} of {allStats.length} courses
        </div>
        
        <div className="flex items-center">
          <div className="flex mr-4">
            <button 
              onClick={prevPage}
              disabled={currentPage === 0}
              className={`px-3 py-0.5 rounded-l ${currentPage === 0 ? ' text-gray-500' : 'text-black border border-black'}`}
            >
              Previous
            </button>
            <button 
              onClick={nextPage}
              disabled={currentPage >= totalPages - 1}
              className={`px-3 py-0.5 rounded-r ${currentPage >= totalPages - 1 ? 'text-gray-500' : 'text-black border border-black'}`}
            >
              Next
            </button>
          </div>
          
          {/* Direct page navigation */}
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Go to:</span>
            <input
              type="text"
              value={pageInputValue}
              onChange={handlePageInputChange}
              onKeyDown={handleKeyDown}
              className="w-10 h-7 border border-black bg-transparent rounded text-center mr-1 text-black"
              placeholder={`${currentPage + 1}`}
            />
            <span className="text-sm text-gray-600 mr-2">/ {totalPages}</span>
            <button
              onClick={goToPage}
              className="px-2 py-1 text-black rounded border border-black hover:bg-gray-500 text-sm"
            >
              Go
            </button>
          </div>
        </div>
      </div>
      
      {props.dept && (
        <div className="mt-4 text-center text-gray-600 text-sm">
          <p>Department: {props.dept}</p>
        </div>
      )}
    </div>
  );
};

export default EnrollmentBarChart;