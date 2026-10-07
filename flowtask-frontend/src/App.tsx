import { useState } from "react";
import { useSelector } from "react-redux";

import type { RootState } from "./store/store";

import Login from "./components/Login";
import Register from "./components/Register";
import TaskList from "./components/TaskList";

function App() {
  const [showRegister, setShowRegister] =
    useState(false);

  const isLoggedIn =
    useSelector(
      (state: RootState) =>
        state.auth.isLoggedIn
    );

  if (isLoggedIn) {
    return <TaskList />;
  }

  if (showRegister) {
    return (
      <Register
        onRegistered={() =>
          setShowRegister(false)
        }
      />
    );
  }

  return (
    <Login
      onRegister={() =>
        setShowRegister(true)
      }
    />
  );
}

export default App;