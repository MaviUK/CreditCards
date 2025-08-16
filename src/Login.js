import React, { useState } from "react";
import { supabase } from "./supabase";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");

  const handleAuth = async () => {
    setError("");
    const fn = isSignUp ? supabase.auth.signUp : supabase.auth.signInWithPassword;
    const { data, error } = await fn({ email, password });

    if (error) return setError(error.message);
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">{isSignUp ? "Sign Up" : "Login"}</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleAuth}
          className="w-full bg-blue-600 text-white py-2 rounded mb-3"
        >
          {isSignUp ? "Create Account" : "Login"}
        </button>
        <p className="text-sm text-center text-gray-600">
          {isSignUp ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 underline"
          >
            {isSignUp ? "Log in" : "Sign up"}
          </button>
        </p>
        {error && <p className="text-red-600 mt-2 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
