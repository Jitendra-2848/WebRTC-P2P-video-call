import React, { useEffect, useState } from "react";
import Login from "./Login";
import Meeting from "./Meeting";
import { store } from "./store/store";
import { Navigate, Route, Routes } from "react-router-dom";

const App = () => {
  const { user, checkuser } = store();
  useEffect(() => {
    checkuser();
  }, []);
  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <Login /> : <Navigate to={`/room/${user.room}`} replace/>}
      />
      <Route
        path="/room/:id"
        element={user ? <Meeting /> : <Navigate to="/" replace/>}
      />
    </Routes>
  );
};

export default App;
