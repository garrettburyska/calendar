import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password) => password.length >= 8;

function LoginPage() {
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [badEntry, setBadEntry] = useState(null);
  const navigate = useNavigate();
  const { login, loggedIn } = useAuth();

  if (loggedIn) {
    return <Navigate to="/home" replace />;
  }

  const handleSubmit = async () => {
    if (await login(email, password)) {
      navigate("/home");
    } else {
      setBadEntry("Invalid email or password");
    }
  };

  const FIRST_PAGE = {
    input: (
      <input
        className="border border-black rounded px-[15px] py-[13px] w-full"
        type="username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
    ),
    buttons: [
      <button
        key="create"
        className="rounded-[20px] px-[24px] hover:bg-[#eaeaeb] text-[#20A4F3]"
      >
        Create Account
      </button>,
      <button
        key="next"
        className="rounded-[20px] px-[24px] bg-[#20A4F3] text-[#F6F7F8] hover:text-[#eaeaeb]"
        onClick={() => {
          if (validateEmail(email)) {
            setBadEntry(null);
            setPasswordOpen(true);
          } else {
            setBadEntry("Please enter a valid email address.");
          }
      }}
      >
        Next
      </button>,
    ],
  };

  const SECOND_PAGE = {
    input: (
      <input
        className="border border-black rounded px-[15px] py-[13px] w-full"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
    ),
    showPassword: (
      <div className="flex flex-row mt-[8px]">
        <input className="border border-black" type="checkbox" value={showPassword} onChange={() => setShowPassword(!showPassword)} />
        <p className="ml-[16px]">Show password</p>
      </div>
    ),
    buttons: [
      <button
        key="back"
        className="rounded-[20px] px-[24px] hover:bg-[#eaeaeb] text-[#20A4F3]"
        onClick={() => {
          setBadEntry(null);
          setPasswordOpen(!passwordOpen)
        }}
      >
        Back
      </button>,
      <button
        key="submit"
        className="rounded-[20px] px-[24px] bg-[#20A4F3] text-[#F6F7F8] hover:text-[#eaeaeb]"
        onClick={() => {
          if (validatePassword(password)) {
            setBadEntry(null);
            handleSubmit();
          } else {
            setBadEntry("Please enter a valid password.");
          }
        }}
      >
        Next
      </button>,
    ],
  };

  return (
    <div className="flex bg-[#eaeaeb] items-center justify-center h-screen">
      <div className="flex bg-[#F6F7F8] flex-row px-[36px] pt-[108px] pb-[36px] rounded-lg">
        <div className="flex flex-col whitespace-nowrap w-[460px]">
          <h2 className="text-3xl font-semibold">Sign in</h2>
          <p>to continue to Calendar</p>
        </div>
        <div className="flex flex-col w-[460px]">
          <div className="h-[214px]">
            {!passwordOpen &&
            <>
              {FIRST_PAGE.input}
              {badEntry && <p className="text-red-400 text-xs">{badEntry}</p>}
            </>}
            {passwordOpen && 
            <>
              {SECOND_PAGE.input}
              {badEntry && <p className="text-red-400 text-xs">{badEntry}</p>}
              {SECOND_PAGE.showPassword}
            </>}
          </div>
          <div className="flex flex-row justify-end">
            {!passwordOpen
            && FIRST_PAGE.buttons}
            {passwordOpen
            && SECOND_PAGE.buttons}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
