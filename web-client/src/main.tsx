import React from "react";
import ReactDOM from "react-dom/client";
import Dashboard from "./routes/Dashboard";
import "./styles/global.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./routes/Login";
import GameSessionPage from "./routes/GameSession";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Login />} />
      <Route path="/game/:sessionId" element={<GameSessionPage />} />
    </Routes>
  </BrowserRouter>
);
