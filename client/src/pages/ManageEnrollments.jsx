// src/pages/ManageEnrollments.jsx
import React from "react";
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useEnrollment } from "../context/enrollmentContext";
import API from "../api";

const ManageEnrollments = () => {
  const { id } = useParams(); // student ID from route
  const {
    loading,
    error,
    requests,              // pending requests
    enrolledCourses,       // enrolled list
    fetchEnrollmentsByStudent,
    verifyEnrollment,
    addStudentToCourse,
    removeStudentFromCourse,
  } = useEnrollment();

  const [student, setStudent] = React.useState(null);
  const [allCourses, setAllCourses] = React.useState([]);

  ////////////////////////////////
  // Fetch data on mount
  ////////////////////////////////
  useEffect(() => {
    const init = async () => {
      await fetchEnrollmentsByStudent(id);
      const res = await API.get(`/users/${id}`);
      setStudent(res.data);
      const coursesRes = await API.get("/courses");
      setAllCourses(coursesRes.data);
    };
    init();
  }, [id]);

  ////////////////////////////////
  // Actions (these now use context functions)
  ////////////////////////////////
  const handleVerify = async (requestId, action) => {
    await verifyEnrollment(requestId, action);
    await fetchEnrollmentsByStudent(id); // refresh context data
  };

  const handleRemoveEnrollment = async (courseId) => {
    await removeStudentFromCourse(id, courseId);
    await fetchEnrollmentsByStudent(id);
  };

  const handleAddEnrollment = async (courseId) => {
    await addStudentToCourse(id, courseId);
    await fetchEnrollmentsByStudent(id);
  };

  ////////////////////////////////
  // Loading / Error States
  ////////////////////////////////
  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  const pendingRequests = requests.filter((r) => r.status === "pending");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Manage Enrollments for {student?.name}
      </h2>
      <p className="text-gray-500 mb-6">{student?.email}</p>

      {/* Pending Requests */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Pending Requests</h3>
        {pendingRequests.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Course</th>
                <th className="border px-4 py-2 text-left">Requested At</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req) => (
                <tr key={req._id}>
                  <td className="border px-4 py-2">{req.course?.title}</td>
                  <td className="border px-4 py-2">
                    {new Date(req.createdAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleVerify(req._id, "approve")}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerify(req._id, "reject")}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No pending requests.</p>
        )}
      </div>

      {/* Enrolled Courses */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Enrolled Courses</h3>
        {enrolledCourses.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Course</th>
                <th className="border px-4 py-2 text-left">Teacher</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {enrolledCourses.map((course) => (
                <tr key={course._id}>
                  <td className="border px-4 py-2">{course.title}</td>
                  <td className="border px-4 py-2">
                    {course.teacher?.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleRemoveEnrollment(course._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">Student not enrolled in any course.</p>
        )}
      </div>

      {/* Add Enrollment Manually */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Add Enrollment</h3>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Course</th>
              <th className="border px-4 py-2 text-left">Teacher</th>
              <th className="border px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {allCourses
              .filter(
                (course) =>
                  !enrolledCourses.some((c) => c._id === course._id)
              )
              .map((course) => (
                <tr key={course._id}>
                  <td className="border px-4 py-2">{course.title}</td>
                  <td className="border px-4 py-2">
                    {course.teacher?.name || "N/A"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleAddEnrollment(course._id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      Enroll
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Link
          to="/students"
          className="inline-block px-4 py-2 bg-gray-500 text-white rounded"
        >
          Back to Students
        </Link>
      </div>
    </div>
  );
};

export default ManageEnrollments;
