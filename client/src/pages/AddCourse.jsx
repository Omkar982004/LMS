import { useState } from "react";
import { useCourses } from "../context/courseContext";
import { useAuth } from "../context/authContext";

export default function CreateCourse() {
  const { createCourse } = useCourses();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    await createCourse(title, description);

    setTitle("");
    setDescription("");
    alert("Course created successfully!");
  };

  // Only teachers/admins can access this page
  if (!["teacher", "admin"].includes(user?.role)) {
    return <p>Access Denied: Only teachers and admins can create courses.</p>;
  }

  return (
    <div>
      <h1>Create a New Course</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:{" "}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <br />
        <label>
          Description:{" "}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Create Course</button>
      </form>
    </div>
  );
}
