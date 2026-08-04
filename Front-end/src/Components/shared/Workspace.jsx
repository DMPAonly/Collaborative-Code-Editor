import { useEffect, useState } from "react";
import { api2 } from "../../api/authApi";
import CreateFileModal from "../CreateFileModal";
import DeleteFileModal from "../DeleteFileModal";
import UploadButton from "../UploadButton";
import FileList from "../FileList";

function Workspace() {
  const [files, setFiles] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchFiles = async () => {
    try {
      const response = await api2.get("/");
      setFiles(response.data.files);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await api2.post("/upload", formData);

      fetchFiles();

      event.target.value = "";

      alert("File uploaded successfully!");
    } catch (error) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  const handleCreateFile = async (filename) => {
    try {
      await api2.post("/create", {
        filename,
      });

      fetchFiles();

      alert("File created successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create file.");
    }
  };

  const handleDeleteFile = async () => {
    try {
      await api2.delete(`/${selectedFile.file_id}`);

      fetchFiles();

      setShowDeleteModal(false);
      setSelectedFile(null);

      alert("File deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete file.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Workspace
          </h1>

          <p className="mt-2 text-slate-400">
            Upload, create and manage your source code files.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-4">
          <UploadButton onFileSelect={handleFileSelect} />

          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg"
          >
            Create File
          </button>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-2xl font-semibold text-slate-200">
            Your Files
          </h2>

          <FileList
            files={files}
            onDelete={(file) => {
              setSelectedFile(file);
              setShowDeleteModal(true);
            }}
          />
        </div>
      </div>

      <CreateFileModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateFile}
      />

      <DeleteFileModal
        isOpen={showDeleteModal}
        filename={selectedFile?.filename}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFile(null);
        }}
        onDelete={handleDeleteFile}
      />
    </div>
  );
}

export default Workspace;
