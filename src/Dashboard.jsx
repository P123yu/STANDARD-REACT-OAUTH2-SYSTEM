import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode the JWT locally so we don't have to make a network call!
      // This is possible because we embedded the claims directly into the token in Spring Boot.
      const decoded = jwtDecode(token);
      setUserData(decoded);
    } catch (err) {
      console.error("Invalid token format", err);
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    // Redirect to Spring Boot logout to clear the session cookie
    window.location.href = "http://localhost:5000/logout";
  };

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900">Standard Security</h1>

        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
              {userData.sub?.charAt(0).toUpperCase() || "U"}
            </span>
            {userData.preferred_username || userData.sub}
          </span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold mb-6">
              Identity Decoded from Token 🎉
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
                  Subject (Username)
                </p>
                <p className="text-lg font-medium">{userData.sub}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
                  Email
                </p>
                <p className="text-lg font-medium">{userData.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
                  User Type
                </p>
                <p className="text-lg font-medium">
                  {userData.userTypeId || "Standard"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">
                  Token Expires (Min)
                </p>
                <p className="text-lg font-medium">
                  {userData.exp_min || 0} minutes
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Assigned Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {userData.roles?.length > 0 ? (
                  userData.roles.map((role, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">
                    No roles assigned
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-2">
                Granted Features
              </p>
              <div className="flex flex-wrap gap-2">
                {userData.features?.length > 0 ? (
                  userData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100"
                    >
                      {feature}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 italic">
                    No features assigned
                  </span>
                )}
              </div>
            </div>

            {/* Simulated UI Feature Toggle based on backend claims */}
            {userData.features?.includes("ADMIN_PANEL") && (
              <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-bold text-yellow-800">
                  🛠️ Admin Settings Visible
                </h4>
                <p className="text-sm text-yellow-700">
                  You can see this because your token contains the ADMIN_PANEL
                  feature!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
