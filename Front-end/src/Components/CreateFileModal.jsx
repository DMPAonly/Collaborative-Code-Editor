import { useState } from "react";

function CreateFileModal({ isOpen, onClose, onCreate }) {
  const [filename, setFilename] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!filename.trim()) return;

    onCreate(filename);

    setFilename("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold">Create File</h2>

        <input
          type="text"
          placeholder="Example: App.js"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          className="mb-6 w-full rounded border p-2 outline-none focus:border-blue-500"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFileModal;
