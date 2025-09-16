import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
  const [isAuth, setIsAuth] = useState(null); // null = loading, true/false = known
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5050/user/check-session", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAuth(data.loggedIn);
        if (data.loggedIn) {
          setUser(data.user);
        }
      })
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>; // show spinner while checking
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuth? <Navigate to="/home" replace /> : <LoginPage setIsAuth={setIsAuth} />} />
        <Route path="/home" element={<HomePage user={user} isAuth={isAuth} setIsAuth={setIsAuth} />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
