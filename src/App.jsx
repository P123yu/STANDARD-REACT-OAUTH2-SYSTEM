import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthorizedPage from "./AuthorizedPage";
import Dashboard from "./Dashboard";
import LoginPage from "./LoginPage";
import SessionManager from "./SessionManager";

function App() {
  return (
    <BrowserRouter>
      {/* Runs silently to auto-refresh tokens before they expire */}
      <SessionManager />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/authorized" element={<AuthorizedPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;