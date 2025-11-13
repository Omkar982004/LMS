import React, { useEffect, useState } from "react";
import { useModules } from "../context/moduleContext";
import { useParams, useNavigate } from "react-router-dom";

export default function ManageModules() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    modules,
    course,
    loading,
    fetchModules,
    addModule,
    updateModule,
    deleteModule,
  } = useModules();

  const [newModule, setNewModule] = useState({ title: "", content: "" });
  const [editingModule, setEditingModule] = useState(null);
  const [editValues, setEditValues] = useState({ title: "", content: "" });

  useEffect(() => {
    fetchModules(courseId);
  }, [courseId]);

  // Add Module
  const handleAddModule = (e) => {
    e.preventDefault();
    if (!newModule.title.trim()) return;
    addModule(courseId, newModule.title, newModule.content);
    setNewModule({ title: "", content: "" });
  };

  // Start Editing
  const handleEditClick = (mod) => {
    setEditingModule(mod._id);
    setEditValues({ title: mod.title, content: mod.content });
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingModule(null);
    setEditValues({ title: "", content: "" });
  };

  // Save Updated Module
  const handleSaveEdit = () => {
    if (!editValues.title.trim()) return;
    updateModule(courseId, editingModule, {
      title: editValues.title,
      content: editValues.content,
    });
    setEditingModule(null);
    setEditValues({ title: "", content: "" });
  };

  // Delete Module
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this module?")) {
      deleteModule(courseId, id);
    }
  };

  // Navigate to Manage Assignments Page
  const handleManageAssignments = (moduleId) => {
    navigate(`/created-courses/${courseId}/modules/${moduleId}/manage-assignments`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Manage Modules for {course?.title || "Course"}
      </h1>

      {loading && <p>Loading modules...</p>}

      {/* --- Add Module Form --- */}
      <form onSubmit={handleAddModule} className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Module Title"
          value={newModule.title}
          onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
          className="border px-2 py-1 w-full rounded"
          required
        />
        <textarea
          placeholder="Content"
          value={newModule.content}
          onChange={(e) =>
            setNewModule({ ...newModule, content: e.target.value })
          }
          className="border px-2 py-1 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Add Module
        </button>
      </form>

      {/* --- List of Modules --- */}
      <ul>
        {modules.map((mod) => (
          <li key={mod._id} className="border p-3 mb-3 rounded shadow-sm">
            {editingModule === mod._id ? (
              <>
                <input
                  type="text"
                  value={editValues.title}
                  onChange={(e) =>
                    setEditValues({ ...editValues, title: e.target.value })
                  }
                  className="border px-2 py-1 w-full mb-2 rounded"
                />
                <textarea
                  value={editValues.content}
                  onChange={(e) =>
                    setEditValues({ ...editValues, content: e.target.value })
                  }
                  className="border px-2 py-1 w-full mb-2 rounded"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg">{mod.title}</h3>
                <p className="text-sm text-gray-700">{mod.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleEditClick(mod)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(mod._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleManageAssignments(mod._id)}
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                  >
                    Manage Assignments
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
