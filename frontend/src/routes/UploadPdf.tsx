import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const UploadPdf: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a PDF file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file); // 'pdf' should match backend field name

        try {
            await axiosInstance.post("http://localhost:5000/api/v1/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            alert("PDF uploaded successfully!");
            navigate("/"); // redirect back to home
        } catch (error) {
            console.error("Error uploading PDF:", error);
            alert("Upload failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Upload PDF</h1>
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mb-4"
            />
            <button
                onClick={handleUpload}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Upload
            </button>
        </div>
    );
};

export default UploadPdf;
