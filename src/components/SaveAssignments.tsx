import { useState, useRef, useEffect } from "react";
import { fetchCourses } from "@/utils/api";

interface SaveAssignmentsProps {
  apiCall: (formData: FormData, courseID: string) => Promise<Response>;
}

interface course{
  course_name:string;
  course_id:string;
}

export default function SaveAssignments({ apiCall}: SaveAssignmentsProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [courses, setCourses] = useState<course[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null);


  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  };

  const handleCourseSelect = (course: string) => {
    setSelectedCourse(course);
    setIsOpen(false);
    fileInputRef.current?.click(); // Open file upload after selection
  };

  useEffect(() => {
    setSelectedCourse(null);
    try{
      const getCourse = async () => {
      const response = await fetchCourses();
      console.log(response.data);
      setCourses(response.data);
    }
      getCourse();
    }catch(error){
      console.log(error)
    }
  },[]);

  return (
    <div className="relative w-full flex flex-col items-start">
      {/* Upload Button */}
      <button
        onClick={toggleDropdown}
        className="w-full text-left flex justify-between items-center bg-[#990011] text-white p-3 rounded-md shadow-md transition-transform duration-200 hover:scale-95"
      >
        {selectedCourse || "Upload Assignments"}
        <span>{isOpen ? ">" : ">"}</span>
      </button>

      {/* Dropdown Dashboard (Slide from Left) */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#77000e] text-white border-r border-gray-300 shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Back Button */}
        <button
          onClick={toggleDropdown}
          className="w-full text-left px-4 py-2 bg-[#55000a] text-white rounded-t-md hover:bg-[#990011]"
        >
          ← Back
        </button>
        
        <ul className="p-4 space-y-2 max-h-[80vh] overflow-y-auto">
          {courses.map((course, index) => (
            <li key={index} className={index < 4 ? "block" : "hidden lg:block"}>
              <button
                className="w-full text-left block px-4 py-2 hover:bg-[#990011] rounded-md transition"
                onClick={() => handleCourseSelect(course.course_id)}
              >
                {course.course_name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* File Upload Input (Hidden) */}
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);

            apiCall(formData, selectedCourse || "")
              .then((response) => {
                if (response.status === 200) {
                  alert("File uploaded successfully!");
                } else {
                  alert("File upload failed.");
                }
              })
              .catch(() => alert("Error uploading file."));
          }
        }}
      />
    </div>
  );
}
