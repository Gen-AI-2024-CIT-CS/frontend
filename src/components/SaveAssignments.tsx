import { useState, useRef } from "react";
import FileUploadButton from "./FileUpload";

interface SaveAssignmentsProps {
  apiCall: (formData: FormData) => Promise<Response>;
}

export default function SaveAssignments({ apiCall }: SaveAssignmentsProps) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const courses = [
    "Data Structures and Algorithms", "Database Management Systems", "Operating System Fundamentals", "Computer Networks", "Artificial Intelligence",
    "Machine Learning", "Cloud Computing", "Internet of Things", "Blockchain Technology", "Software Engineering",
    "Psychology", "Statistics", "Business Studies", "Environmental Science"
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleCourseSelect = (course: string) => {
    setSelectedCourse(course);
    setIsOpen(false);
    fileInputRef.current?.click(); // Open file upload after selection
  };

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
                onClick={() => handleCourseSelect(course)}
              >
                {course}
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

            apiCall(formData)
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
