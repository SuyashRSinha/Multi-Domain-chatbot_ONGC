import { useState, useRef } from "react";
import { uploadDocument } from "../services/uploadService";
import { useAuth } from "../contexts/AuthContext";

function UploadDocument({
  domain,
  loadDocuments
}) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    if (!currentUser) {
      alert("User not logged in.");
      return;
    }

    setUploading(true);

    try {
      const response = await uploadDocument(
        file,
        domain,
        currentUser.uid
      );
      alert(response.message);
      setFile(null);
      loadDocuments();
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail ||
        "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-transparent flex flex-col h-full justify-between">
      <div>
        <h2 className="text-xl font-extrabold text-purple-900 tracking-tight mb-2">
          Upload Knowledge Base
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Upload PDF, DOC, or DOCX files to train the chatbot on this specific domain.
        </p>

        {/* Dashed Dropzone */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="border-2 border-dashed border-purple-300 hover:border-purple-400 bg-white/20 hover:bg-white/40 rounded-2xl p-8 text-center cursor-pointer transition duration-200 flex flex-col items-center justify-center gap-3 shadow-inner"
        >
          <input
            type="file"
            ref={fileInputRef}
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
          />

          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
            </svg>
          </div>

          <div className="text-xs">
            <span className="font-bold text-purple-700">Click to upload</span> or drag and drop
          </div>
          <span className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 10MB</span>
        </div>

        {file && (
          <div className="mt-4 flex items-center gap-2 bg-purple-50/50 border border-purple-100 px-3.5 py-2 rounded-xl text-xs text-purple-950 shadow-sm">
            <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="truncate font-semibold flex-1">{file.name}</span>
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="text-slate-400 hover:text-red-500 transition cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/10 text-white font-bold py-2.5 rounded-xl transition duration-200 active:scale-[0.98] disabled:from-slate-300 disabled:to-slate-400 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer text-xs flex items-center justify-center gap-1.5"
      >
        {uploading ? (
          <>
            <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </>
        ) : (
          "Train Model"
        )}
      </button>
    </div>
  );
}

export default UploadDocument;