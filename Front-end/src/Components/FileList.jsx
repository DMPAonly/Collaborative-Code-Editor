import { useNavigate } from "react-router-dom";
import FileCard from "./FileCard";

function FileList({ files, onDelete }) {
  const navigate = useNavigate();

  if (files.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-white py-12 text-center">
        <h3 className="text-lg font-semibold text-gray-700">No files found</h3>

        <p className="mt-2 text-gray-500">
          Upload a file or create a new one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          onClick={() => navigate(`/file/${file.id}`)}
          onDelete={() => onDelete(file)}
        />
      ))}
    </div>
  );
}

export default FileList;
