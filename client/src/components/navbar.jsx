import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const pageTitles = {
    "/": "Homepage",
    "/signup": "Signup",
    "/login": "Login",
    "/courses": "Courses",
    "/assignments": "Assignments",
    "/created-courses": "My Classes",
    "/teach/gradebook": "Gradebook",
    "/admin/dashboard": "Admin Dashboard",
    "/students": "Manage Students",
    "/my-enrollments": "Enrolled Courses",
  };

  const getPageTitle = (path) => {
  if (path.startsWith("/students/") && path.endsWith("/manage-enrollments")) {
    return "Manage Enrollments";
  }
  return pageTitles[path] || "Page";
};
  const pageTitle = getPageTitle(location.pathname);


  const roleLinks = {
    student: [
      { to: "/my-enrollments", label: "My Courses" },
      { to: "/assignments", label: "Assignments" },
    ],
    teacher: [
      { to: "/created-courses", label: "My Classes" },
      { to: "/add-course", label: "Add Course" },
      { to: "/teach/gradebook", label: "Gradebook" },
    ],
    admin: [
      { to: "/admin/dashboard", label: "Admin Dashboard" },
      { to: "/students", label: "manage students" },
    ],
  };

  const links = roleLinks[user?.role] || [];

  return (
    <header>
      <h1>{pageTitle}</h1>

      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          {!user && (
            <>
              <li>
                <Link to="/signup">Signup</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}

          {/* Only when logged in */}
          {user && (
            <>
              <li><Link to="/courses">Courses</Link></li>
              {links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {user ? (
        <p>
          Logged in as: {user.name} ({user.role})
        </p>
      ) : (
        <p>Not logged in</p>
      )}
    </header>
  );
}
