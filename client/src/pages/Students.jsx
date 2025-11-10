import React, { useEffect } from "react";
import { useStudents } from "../context/studentContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Students() {
  const { students, loading, error, fetchStudents, clearError } = useStudents();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "admin" || user?.role === "teacher") {
      fetchStudents();
    }
    return () => clearError();
  }, [user]);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">

      {students && students.length > 0 ? (
        <table className="min-w-full border border-gray-300 text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50">
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">
                  <button
                    onClick={() => navigate(`/students/${student._id}/manage-enrollments`)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Manage Enrollments
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
}
