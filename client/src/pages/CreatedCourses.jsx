import { useEffect } from "react";
import { useCourses } from "../context/courseContext";
import { useNavigate } from "react-router-dom";

export default function CreatedCourses() {
  const { courses, loading, error, fetchCreatedCourses } = useCourses();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCreatedCourses();
  }, []);

  return (
    <div>
      {loading && <p>Loading courses...</p>}
      {error && <p>{error}</p>}
      {!loading && courses.length === 0 && <p>No courses created yet.</p>}

      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>
              <strong>Teacher:</strong> {course.teacher?.name} (
              {course.teacher?.email})
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
