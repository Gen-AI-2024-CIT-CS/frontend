import { useRef, useState } from "react";

interface FileUploadButtonProps {
  apiCall: (formData: FormData) => Promise<Response>;
  buttonText: string;
}

export default function FileUploadButton({ apiCall,buttonText }: FileUploadButtonProps) {
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
        const response = await apiCall(formData);

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
      <button
        onClick={handleButtonClick}
        className="block w-full px-3 py-2 text-center rounded-md hover:bg-[#660000] transition transform duration-200 hover:scale-95 border-white border-[1px]"
      >
        {buttonText}
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
