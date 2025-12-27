import React, { useState } from "react";
import { store } from "./store/store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [room, setroom] = useState("");
  const navigate = useNavigate();
const {onjoin} = store()
  const handleSubmit = (e) => {
    e.preventDefault();
    onjoin({ email,room });
    navigate(`/room/${room}`)
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-blue-400">
      <form
        onSubmit={handleSubmit}
        className="bg-violet-700 w-96 h-80 rounded-md flex flex-col justify-center items-center space-y-4"
      >
        <h1 className="text-3xl font-semibold text-white">Join Meeting</h1>

        <input
          type="text"
          placeholder="Enter Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="bg-gray-300 px-2 w-8/12 py-2 rounded-md"
        />

        <input
          type="number"
          placeholder="Enter room no.."
          value={room}
          required
          onChange={(e) => setroom(e.target.value)}
          className="bg-gray-300 px-2 w-8/12 py-2 rounded-md"
        />

        <button className="bg-green-300 px-10 py-2 rounded-md font-semibold">
          Join
        </button>
      </form>
    </div>
  );
};

export default Login;
