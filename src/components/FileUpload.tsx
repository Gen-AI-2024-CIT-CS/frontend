import { useRef, useState } from "react";
import { saveAssignment } from "@/utils/api";

export default function FileUploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append("file", file);

      try {
        // Update the URL to match your API server
        const response = await saveAssignment(formData);

        if (response.status === 200) {
          setUploadStatus("File uploaded successfully!");
        } else {
          setUploadStatus("Failed to upload file.");
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        setUploadStatus("Error uploading file.");
      }
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick} className="p-2 bg-blue-500 text-white rounded">
        Upload CSV
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
