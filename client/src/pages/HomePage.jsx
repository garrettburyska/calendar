import ProtectedRoute from "../ProtectedRoute";
import { useAuth } from "../AuthContext";

function HomePage() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
      <h1>Welcome {user ? user : "..."}</h1>
      <p>You are logged in 🎉</p>

      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
}

function ProtectedHomePage({ ...props }) {
  return (
    <ProtectedRoute>
      <HomePage {...props} />
    </ProtectedRoute>
  );
}

export default ProtectedHomePage;
