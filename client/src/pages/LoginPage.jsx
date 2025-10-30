import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FaExclamation } from "react-icons/fa6";

// Validation functions
const validateEmail = e => /\S+@\S+\.\S+/.test(e);
const validatePassword = p => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(p);

function LoginPage() {
  const navigate = useNavigate();
  const { login, loggedIn } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [badEntry, setBadEntry] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (loggedIn) navigate("/home");
  }, [loggedIn, navigate]);

  const handleSubmit = async () => {
    if (!validateEmail(email)) setBadEntry("Please enter a valid email.");
    else if (!validatePassword(password)) setBadEntry("Please enter a valid password.");
    else {
      if (await login(email, password)) navigate("/home");
      else setBadEntry("Invalid email or password");
    }
  };

  return (
    <div className="flex bg-[#eaeaeb] items-center justify-center h-screen">
      <div className="bg-[#F6F7F8] rounded-lg p-8 w-[464px]">
        <h2 className="text-3xl font-bold">Sign In</h2>
        <p className="text-gray-500 mb-4">To continue to Calendar</p>
        <div className="w-[400px]">
          <p className="font-bold">Email</p>
          <input
            className="border border-black rounded-lg px-[15px] py-[13px] w-full mb-4"
            type="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <p className="font-bold">Password</p>
          <input
            className="border border-black rounded-lg px-[15px] py-[13px] w-full"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <div className="flex flex-row mt-1">
            <input className="border border-black" type="checkbox" value={showPassword} onChange={() => setShowPassword(!showPassword)} />
            <p className="ml-[16px]">Show password</p>
          </div>
        </div>
        {badEntry && <span className="flex flex-row gap-2 text-black items-center w-full p-2 bg-[#eaeaeb] rounded-lg mt-4 text-xs"><FaExclamation color="red" size={18} />{badEntry}</span>}
        <button
          key="submit"
          className="w-full mt-4 bg-[#20A4F3] text-[#F6F7F8] p-2 rounded-lg"
          onClick={() => handleSubmit()}
        >
          Sign In
        </button>
        <a className="flex justify-center text-sm mt-4 underline hover:no-underline hover:cursor-pointer text-[#20A4F3]" onClick={() => navigate("/accounts/create-account")}>Create account</a>
      </div>
    </div>
  );
}

export default LoginPage;
