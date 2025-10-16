import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { FaExclamation } from "react-icons/fa6";

function CreateAccountPage() {
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [name, setName] = useState("");
    const [badEntry, setBadEntry] = useState(null);
    
    const navigate = useNavigate();
    const { loggedIn } = useAuth();

    useEffect(() => {
        if (loggedIn) navigate("/home");
    }, [loggedIn, navigate]);
    
    const handleSubmit = async () => {
        if (password1 !== password2) setBadEntry("Passwords do not match.");
        else {
            const res = await fetch("http://localhost:5050/api/user/create-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password: password1, name }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error(errorData.message);
                setBadEntry(errorData.message);
            } else {
                navigate("/login");
            }
        }
    };

    return (
        <div className="flex bg-[#eaeaeb] items-center justify-center h-screen">
              <div className="bg-[#F6F7F8] rounded-lg p-8 w-[464px]">
                <h2 className="text-3xl font-bold">Create Account</h2>
                <p className="text-gray-500 mb-4">To continue to Calendar</p>
                <div className="w-[400px]">
                  <p className="font-bold">Name</p>
                  <input
                    className="border border-black rounded-lg px-[15px] py-[13px] w-full mb-2"
                    type="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                  />
                  <p className="font-bold">Email</p>
                  <input
                    className="border border-black rounded-lg px-[15px] py-[13px] w-full mb-4"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                  />
                  <p className="font-bold">Password</p>
                  <input
                    className="border border-black rounded-lg px-[15px] py-[13px] w-full"
                    type="password"
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    placeholder="Password"
                    required
                  />
                  <input
                    className="border border-black rounded-lg px-[15px] py-[13px] w-full mt-2"
                    type="password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                {badEntry && <span className="flex flex-row gap-2 text-black items-center w-full p-2 bg-[#eaeaeb] rounded-lg mt-4 text-xs"><FaExclamation color="red" size={18} />{badEntry}</span>}
                <button
                  key="submit"
                  className="w-full mt-4 bg-[#20A4F3] text-[#F6F7F8] p-2 rounded-lg"
                  onClick={() => handleSubmit()}
                >
                  Create Account
                </button>
                <a className="flex justify-center text-sm mt-4 underline hover:no-underline hover:cursor-pointer text-[#20A4F3]" onClick={() => navigate("/login")}>Back to Login</a>
              </div>
            </div>
    );
};

export default CreateAccountPage;