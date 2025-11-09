import { useAuth } from "../context/authContext";

export default function Homepage() {
  const { user, token, loading, error, message, isAuthenticated } = useAuth();

  return (
    <div>
      <h2>Authentication State</h2>
      <pre>
        {JSON.stringify(
          { user, token, loading, error, message, isAuthenticated },
          null,
          2
        )}
      </pre>

      {user && (
        <div>
          <h3>Welcome, {user.name}</h3>
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  );
}
