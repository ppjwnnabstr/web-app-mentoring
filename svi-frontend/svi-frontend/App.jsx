import React from "react";
import LoginPage from "./LoginPage";

export default function App() {
  const handleSubmit = async ({ email, password, remember }) => {
    // Replace with your real auth call
    console.log("Signing in:", { email, remember });
    await new Promise((resolve) => setTimeout(resolve, 900));
  };

  return <LoginPage onSubmit={handleSubmit} />;
}
