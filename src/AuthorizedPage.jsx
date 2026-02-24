import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const AuthorizedPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const code = searchParams.get("code");
    if (code) {
      hasFetched.current = true;
      exchangeCodeForToken(code);
    } else {
      setError("Authorization code not found in URL.");
    }
  }, [searchParams]);

  const exchangeCodeForToken = async (code) => {
    const codeVerifier = sessionStorage.getItem("code_verifier");

    if (!codeVerifier) {
      setError("Security Error: Missing code verifier. Please log in again.");
      return;
    }

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", "public-client");
    params.append("redirect_uri", "http://localhost:5173/authorized");
    params.append("code", code);
    params.append("code_verifier", codeVerifier);

    try {
      const response = await axios.post(
        "http://localhost:5000/oauth2/token",
        params.toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      sessionStorage.removeItem("code_verifier");

      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      localStorage.setItem("id_token", response.data.id_token);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Failed to exchange code for token.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {error ? (
        <div className="p-4 bg-red-100 text-red-600 rounded-lg shadow font-bold text-center">
          <p>{error}</p>
          <button onClick={() => navigate("/login")} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">
            Back to Login
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Securing your session...</h2>
        </div>
      )}
    </div>
  );
};

export default AuthorizedPage;