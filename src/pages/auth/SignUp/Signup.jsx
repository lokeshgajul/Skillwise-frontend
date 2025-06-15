import React, { useState } from "react";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { SignUp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const result = await SignUp(username, email, password);
      if (result) {
        navigate("/signin");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mt-16 flex items-center justify-center ">
      <form
        onSubmit={handleSignup}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <input
          type="name"
          className="w-full px-4 py-2 border rounded"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full px-4 py-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full px-4 py-2 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="text-center flex justify-center items-center bg-blue-500 hover:text-white p-2 ">
          <span>Sign Up</span>
        </button>
        {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

        <div className="flex justify-end items-end gap-2">
          <span className="text-blue-600">Already have an account?</span>
          <span>
            <Link to="/signin">Log In</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signup;
