import { useNavigate } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

function HomePage({ user, setIsAuth }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch("http://localhost:5050/user/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
      <h1>Welcome {user ? user.email : "..."}</h1>
      <p>You are logged in 🎉</p>

      <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
}

function ProtectedHomePage({ isAuth, ...props }) {
  return (
    <ProtectedRoute isAuth={isAuth}>
      <HomePage {...props} />
    </ProtectedRoute>
  );
}

export default ProtectedHomePage;
