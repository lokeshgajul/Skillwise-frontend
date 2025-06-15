import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    navigate("/home");
  };
  return (
    <div className="mt-16 flex items-center justify-center ">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Log In</h2>

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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Log In
        </button>
        {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

        <div className="flex justify-end items-end gap-2">
          <span className="text-blue-600">Create new account?</span>
          <span>
            <Link to="/signup">Sign up</Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Signin;
