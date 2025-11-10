import { useEffect } from "react";
import { useCourses } from "../context/courseContext";
import { useEnrollment } from "../context/enrollmentContext";
import { useAuth } from "../context/authContext";

export default function Courses() {
  const { fetchCourses, courses, loading, error } = useCourses();
  const {
    requestEnrollment,
    requests,
    enrolledCourses,
    loading: enrollLoading,
  } = useEnrollment();
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading || enrollLoading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;

  // Helper: check enrollment/request status for each course
  const getEnrollmentStatus = (courseId) => {
    if (enrolledCourses?.some((c) => c._id === courseId)) return "enrolled";
    const pendingReq = requests?.find(
      (r) => r.course?._id === courseId && r.status === "pending"
    );
    if (pendingReq) return "pending";
    return "none";
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">All Courses</h1>

      {courses && courses.length > 0 ? (
        <ul className="space-y-4">
          {courses.map((course) => {
            const status = getEnrollmentStatus(course._id);

            return (
              <li
                key={course._id}
                className="border rounded-xl p-4 shadow-sm flex flex-col gap-2"
              >
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p>{course.description}</p>
                <p className="text-sm text-gray-600">
                  Teacher: {course.teacher?.name} ({course.teacher?.email})
                </p>

                {/* Student-specific buttons */}
                {user?.role === "student" && (
                  <div className="mt-2">
                    {status === "none" && (
                      <button
                        onClick={() => requestEnrollment(course._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      >
                        Request Enrollment
                      </button>
                    )}
                    {status === "pending" && (
                      <span className="text-yellow-600 font-medium">
                        Pending Approval
                      </span>
                    )}
                    {status === "enrolled" && (
                      <span className="text-green-600 font-medium">
                        Enrolled
                      </span>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}
