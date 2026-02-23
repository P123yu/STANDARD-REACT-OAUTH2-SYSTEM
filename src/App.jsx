import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthorizedPage from "./AuthorizedPage";
import Dashboard from "./Dashboard";
import LoginPage from "./LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        {/* OAuth2 Callback Route */}
        <Route path="/authorized" element={<AuthorizedPage />} />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
