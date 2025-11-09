import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Homepage from './pages/Homepage';
import { useAuth } from './context/authContext';
import Navbar from './components/navbar';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected route for homepage */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Homepage /> : <Navigate to="/login" replace />
          }
        />

        {/* Redirect everything else */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
