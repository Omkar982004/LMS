import { useEffect } from "react";
import { useEnrollment } from "../context/enrollmentContext";
import { useAuth } from "../context/authContext";

export default function MyEnrollments() {
  const { user } = useAuth();
  const {
    loading,
    error,
    requests,
    enrolledCourses,
    fetchMyEnrollments,
    clearError,
  } = useEnrollment();

  useEffect(() => {
    if (user?._id) fetchMyEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        <p>{error}</p>
        <button
          onClick={clearError}
          className="mt-2 px-3 py-1 bg-gray-700 text-white rounded"
        >
          Dismiss
        </button>
      </div>
    );

  const enrolled = enrolledCourses || [];
  const pending = requests?.filter((r) => r.status === "pending") || [];

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">My Enrollments</h1>

      {/* --- Enrolled Courses --- */}
      <section className="mb-10">
        <h2 className="text-xl font-medium mb-4">Enrolled Courses</h2>
        {enrolled.length === 0 ? (
          <p className="text-gray-500">
            You’re not enrolled in any courses yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {enrolled.map((course) => (
              <div
                key={course._id}
                className="border rounded-xl p-4 shadow-sm bg-white"
              >
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {course.description || "No description available."}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Teacher:</strong> {course.teacher?.name || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* --- Pending Requests --- */}
      <section>
        <h2 className="text-xl font-medium mb-4">Pending Requests</h2>
        {pending.length === 0 ? (
          <p className="text-gray-500">No pending enrollment requests.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {pending.map((req) => (
              <div
                key={req._id}
                className="border rounded-xl p-4 shadow-sm bg-yellow-50 border-yellow-300"
              >
                <h3 className="font-semibold text-lg">
                  {req.course?.title || "Untitled Course"}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {req.course?.description || "No description available."}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  <strong>Status:</strong> {req.status}
                </p>
                <p className="mt-1 text-sm text-gray-700">
                  <strong>Teacher:</strong>{" "}
                  {req.course?.teacher?.name || "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
