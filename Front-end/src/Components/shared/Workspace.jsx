import { useEffect, useState } from "react";
import { api } from "../../api/authApi";
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
      const response = await api.get("/files");
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
      await api.post("/files/upload", formData);

      // Refresh file list
      fetchFiles();

      // Allow uploading the same file again
      event.target.value = "";

      alert("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Upload failed");
    }
  };

  const handleCreateFile = async (filename) => {
    try {
      await api.post("/files/create", {
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
      await api.delete(`/files/${selectedFile.id}`);

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
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-5xl p-8">
        <h1 className="mb-8 text-4xl font-bold">Workspace</h1>

        <div className="mb-8 flex gap-4">
          <UploadButton onFileSelect={handleFileSelect} />

          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
          >
            Create File
          </button>
        </div>

        <h2 className="mb-4 text-2xl font-semibold">Uploaded Files</h2>

        <FileList
          files={files}
          onDelete={(file) => {
            setSelectedFile(file);
            setShowDeleteModal(true);
          }}
        />
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
