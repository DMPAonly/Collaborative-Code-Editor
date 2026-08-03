function FileCard({ file, onClick, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm hover:shadow-md">
      <div onClick={onClick} className="flex-1 cursor-pointer">
        <h3 className="font-semibold">{file.filename}</h3>
        <p className="text-sm text-gray-500">{file.language}</p>
        <p className="text-xs text-gray-400 mt-1">
          Uploaded: {new Date(file.created_at).toLocaleString()}
        </p>
      </div>

      <button
        onClick={onDelete}
        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}

export default FileCard;
