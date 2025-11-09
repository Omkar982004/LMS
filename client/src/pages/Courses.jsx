import { useEffect } from "react";
import { useCourses } from "../context/courseContext";

export default function Courses() {
  const { fetchCourses, courses, loading, error } = useCourses();

  useEffect(() => {
    fetchCourses();
  }, []);

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>All Courses</h1>
      {courses && courses.length > 0 ? (
        <ul>
          {courses.map((course) => (
            <li key={course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>
                Teacher: {course.teacher?.name} ({course.teacher?.email})
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
}
