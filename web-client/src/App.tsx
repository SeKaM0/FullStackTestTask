import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from "./routes/Dashboard";
import Login from "./routes/Login";
import PlayingRoom from "./routes/PlayingRoom";

const App: React.FC = () => {
  return (
    <Router>
      <Route path="/dashboard" element={<Dashboard />} />
    </Router>
  );
};

export default App;
