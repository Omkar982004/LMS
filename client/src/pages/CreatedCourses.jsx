import { useEffect } from "react";
import { useCourses } from "../context/courseContext";
import { useNavigate } from "react-router-dom";

export default function CreatedCourses() {
  const { courses, loading, error, fetchCreatedCourses } = useCourses();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCreatedCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (courses.length === 0) return <p>No courses created yet.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Created Courses</h1>

      <ul className="space-y-4">
        {courses.map((course) => (
          <li
            key={course._id}
            className="border rounded-xl p-4 shadow-sm flex flex-col gap-2 bg-white"
          >
            <h3 className="text-lg font-semibold">{course.title}</h3>
            <p className="text-gray-700">{course.description}</p>
            <p className="text-sm text-gray-600">
              <strong>Teacher:</strong> {course.teacher?.name} (
              {course.teacher?.email})
            </p>

            <div className="mt-3 flex gap-3">
              {/*  View Modules Button */}
              <button
                onClick={() => navigate(`/created-courses/${course._id}/manage-modules`)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Manage Modules
              </button>

              {/* (Optional) You can add Edit or Delete Course buttons here */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
