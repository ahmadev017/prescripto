import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContextProvider";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const endpoint = isSignUp ? "/api/user/register" : "/api/user/login";
      const payload = isSignUp
        ? { name, email, password }
        : { email, password };

      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(
          data.message ||
            (isSignUp ? "Registered successfully!" : "Logged in successfully!")
        );
        navigate("/"); // move here to avoid redirect from just context change
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  //useEffect(() => {
  // if (token) {
  //  navigate('/');
  //}
  //}, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler}>
      <div className="flex flex-col gap-3 m-auto mt-30 items-start p-8 w-[340px] sm:w-96 rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {isSignUp ? "Create Account" : "Login"}
        </p>
        <p>Please {isSignUp ? "sign up" : "log in"} to book an appointment</p>

        {isSignUp && (
          <div className="w-full">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-md text-base cursor-pointer"
        >
          {isSignUp ? "Create Account" : "Login"}
        </button>

        <p>
          {isSignUp ? "Already have an account? " : "Create a new account? "}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 underline cursor-pointer"
          >
            {isSignUp ? "Login here" : "Click here"}
          </span>
        </p>
      </div>
    </form>
  );
};

export default Login;
