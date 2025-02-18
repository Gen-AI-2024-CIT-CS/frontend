"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { fetchCourses, logout } from '../../utils/api';
import Bargraph from '@/components/Bargraph';
import RegisteredStudents from '@/components/RegisteredStudents';
import FileUploadButton from "@/components/FileUpload";
import { saveAssignment, saveStudents, saveCoursesEnrolled } from "../../utils/api";
import ExamRegistered from '@/components/ExamRegisteredStudent';
import SaveAssignments from "@/components/SaveAssignments";
import GrafanaEmbed from '@/components/GrafanaEmbed';
import Student from "@/components/Student";
import AverageAssignment from "@/components/AverageAssignment";

const departments = [
  { short: "All Departments", full: "All Departments" },
  { short: "CS", full: "Cyber Security" },
  { short: "CSE", full: "Computer Science and Engineering" },
  { short: "AIML", full: "Artificial Intelligence and Machine Learning" },
  { short: "ECE", full: "Electronics and Communication Engineering" },
  { short: "BME", full: "Biomedical Engineering" },
  { short: "EEE", full: "Electrical and Electronics Engineering" },
  { short: "MCT", full: "Mechatronics" },
  { short: "MECH", full: "Mechanical Engineering" },
  { short: "CE", full: "Civil Engineering" },
  { short: "IT", full: "Information Technology" },
  { short: "AIDS", full: "Artificial Intelligence and Data Science" },
  { short: "CSBS", full: "Computer Science and Business Systems" },
];

interface course{
  course_name:string;
  course_id:string;
}

const Dashboard: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState({ short: "Select Department", full: "" });
  const [selectedCourse, setSelectedCourse] = useState({ course_name: "Select Course", course_id: "" });
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<course[]>([])
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    setUserRole(role);
    try{
      const getCourse = async () => {
      const response = await fetchCourses();
      setCourses(response.data);
    }
      getCourse();
    }catch(error){
      console.log(error)
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Selected file:', file);
    }
  };

  const handleChatboxAccess = () => {
    if (userRole === 'admin') {
      router.push('/chatbox');
      router.refresh();
    } else {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
    }
  };

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleSelectDepartment = (department: { short: string; full: string }) => {
    setSelectedDepartment(department);
    setOpenDropdown(null);
  };

  const handleSelectCourse = (course: course) => {
    setSelectedCourse({ course_name: course.course_name, course_id: course.course_id });
    setOpenDropdown(null);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.short.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-100">
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className={`h-screen w-3/5 md:w-1/6 bg-[#990011] text-white flex flex-col p-4 pt-0 justify-start transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-10`}>
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="focus:outline-none">
            <div className="text-3xl text-white">&lt;</div>
          </button>
        </div>

        <div className="flex flex-col justify-start h-full">
          <h2 className="text-xl font-bold mb-4 mt-2">Filters</h2>
          <div className="flex flex-col space-y-2">
            {/* Department Dropdown */}
            <div className="relative">
              <button className="w-full text-left flex justify-between items-center bg-[#990011] p-2 rounded-md shadow-md transition transform duration-200 hover:scale-95" onClick={() => toggleDropdown('department')}>
                {selectedDepartment.short}
                <span>{openDropdown === 'department' ? "▲" : "▼"}</span>
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openDropdown === 'department' ? "max-h-60" : "max-h-0"}`}>
                <input
                  type="text"
                  placeholder="Search Department..."
                  className="w-full p-2 rounded-md mb-2 text-black"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const foundDept = filteredDepartments[0];
                      if (foundDept) handleSelectDepartment(foundDept);
                    }
                  }}
                />
                <ul className="mt-2 space-y-1 bg-[#77000e] p-2 rounded-lg max-h-40 overflow-y-auto">
                  {filteredDepartments.map((dept) => (
                    <li key={dept.short}>
                      <button className="w-full text-left hover:bg-[#990011] p-2 rounded-md" onClick={() => handleSelectDepartment(dept)}>
                        {dept.short}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Course Dropdown */}
            <div className="relative">
              <button className="w-full text-left flex justify-between items-center bg-[#990011] p-2 rounded-md shadow-md transition transform duration-200 hover:scale-95" onClick={() => toggleDropdown('course')}>
                {selectedCourse.course_name}
                <span>{openDropdown === 'course' ? "▲" : "▼"}</span>
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openDropdown === 'course' ? "max-h-60" : "max-h-0"}`}>
                <input
                  type="text"
                  placeholder="Search Course..."
                  className="w-full p-2 rounded-md mb-2 text-black"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const foundCourse = filteredCourses[0];
                      if (foundCourse) handleSelectCourse(foundCourse);
                    }
                  }}
                />
                <ul className="mt-2 space-y-1 bg-[#77000e] p-2 rounded-lg max-h-40 overflow-y-auto">
                  {filteredCourses.map((course) => (
                    <li key={course.course_id}>
                        <button className="w-full text-left hover:bg-[#990011] p-2 rounded-md" onClick={() => handleSelectCourse(course)}>
                          {course.course_name}
                        </button>
                      </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => router.push('/dashboard/mentor-mentee')}
                className="w-full text-left bg-[#990011] hover:bg-[#77000e] p-2 rounded-md shadow-[1px_2px_4px_rgba(0,0,0,0.5)] transition transform duration-200 hover:scale-95 mt-4"
                >
                Mentor-Mentee List
              </button>
            </div>
          </div>
          {/* Spacer to push content to the bottom */}
          <div className="flex flex-col items-center justify-center h-full w-full">
          {/* Spacer to push content to the bottom */}
          <div className="flex-grow"></div>

          {showMessage && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-red-500 text-white p-4 rounded-md shadow-lg">
                Could not access ChatBot. Please contact admin.
              </div>
            </div>
          )}
          <nav className="mt-6 space-y-2 mb-4 w-full max-w-md">
            <button onClick={handleChatboxAccess} className="block w-full px-3 py-2 text-center rounded-md hover:bg-[#660000] transition transform duration-200 hover:scale-95">
              ChatBot
            </button>
            <>
            <input
              title="SendFile"
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <FileUploadButton apiCall={saveCoursesEnrolled} buttonText="Upload Registered" courseID=""/>
            <FileUploadButton apiCall={saveStudents} buttonText="Upload Students" courseID=""/>
            <SaveAssignments apiCall={saveAssignment}/>
          </>
          </nav>

          <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-md mt-6 md:mt-4 w-full max-w-md transition transform duration-200 hover:scale-95" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      </div>


      {/* Main Content */}
      <div className="w-full md:w-4/5 p-4 md:p-8" id="dashboard-container">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 p-4 rounded-md text-black">DASHBOARD</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#dedada] p-4 rounded-md text-center h-32"><Student dept={selectedDepartment.full} courseID={selectedCourse.course_id}/></div>
          <div className="bg-[#dedada] p-4 rounded-md text-center h-32"><RegisteredStudents dept={selectedDepartment.full} courseID={selectedCourse.course_id}/></div>
          <div className="bg-[#dedada] p-4 rounded-md text-center h-32"><ExamRegistered dept={selectedDepartment.full} courseID={selectedCourse.course_id}/></div>
          <div className="bg-[#dedada] p-4 rounded-md text-center h-32"><AverageAssignment dept={selectedDepartment.full} courseId={selectedCourse.course_id}/></div>
          <div className="bg-[#dedada] p-4 rounded-md text-center col-span-1 md:col-span-2 lg:col-span-3"><Bargraph dept={selectedDepartment.full} courseId={selectedCourse.course_id}/></div>
          <div className="bg-[#dedada] p-4 rounded-md text-center h-64">Pie Chart representation of course completed</div>
        </div>
        <div className="bg-[#dedada] p-4 rounded-md text-center h-32">Total Average of students completed their assignments</div>
        
      </div>
    </div>
    </div>
  );
};

export default Dashboard;