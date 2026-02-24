import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const SessionManager = () => {
  useEffect(() => {
    let timeoutId;

    const setupRefreshTimer = () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) return;

      try {
        const decoded = jwtDecode(accessToken);
        const currentTime = Date.now();
        const expiryTime = decoded.exp * 1000; 
        
        // Refresh token 60 seconds before it expires
        const timeUntilRefresh = expiryTime - currentTime - 60000;

        if (timeUntilRefresh > 0) {
          timeoutId = setTimeout(silentRefresh, timeUntilRefresh);
        } else {
          silentRefresh();
        }
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    };

    const silentRefresh = async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return;

      try {
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("client_id", "public-client");
        params.append("redirect_uri", "http://127.0.0.1:8081/login/oauth2/code/public-client");
        params.append("refresh_token", refreshToken);

        const response = await axios.post(
          "http://localhost:5000/oauth2/token",
          params.toString(),
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        localStorage.setItem("access_token", response.data.access_token);
        if (response.data.refresh_token) localStorage.setItem("refresh_token", response.data.refresh_token);
        if (response.data.id_token) localStorage.setItem("id_token", response.data.id_token);

        setupRefreshTimer(); // Restart timer with new token
      } catch (error) {
        console.error("Silent refresh failed.", error);
        localStorage.clear();
        window.location.href = "/login";
      }
    };

    setupRefreshTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []); 

  return null; // Invisible component
};

export default SessionManager;