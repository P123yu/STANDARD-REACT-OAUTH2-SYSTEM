# 🛡️ React OAuth2 PKCE Client

This is the frontend application for the **Standard Security** project. It is a modern React application built with Vite that implements the **OAuth2 Authorization Code Flow with PKCE (Proof Key for Code Exchange)**. 

It acts as a secure Public Client connecting to a Spring Boot Authorization Server, featuring smart token management and silent background refreshing.

---

## ✨ Features

* **OAuth2 PKCE Integration:** Securely generates `code_verifier` and `code_challenge` directly in the browser to prevent authorization code interception.
* **Silent Background Refreshing:** A headless `<SessionManager />` component continuously monitors the JWT expiration and automatically requests a new access token 60 seconds before it expires.
* **Smart API Client (`api.js`):** A custom Axios instance that automatically attaches the `Bearer` token to requests. If a `401 Unauthorized` occurs, it pauses the request, refreshes the token, and seamlessly retries the failed API call.
* **Stateless UI Rendering:** Uses `jwt-decode` to extract `roles`, `features`, and `userTypeId` directly from the token, preventing unnecessary network calls to fetch user data.
* **Interactive Login UI:** Features an animated login page with SVG elements that track mouse movement and typing focus.

---

## 🛠️ Tech Stack

* **React 18** (Bootstrapped with Vite)
* **React Router DOM v6** (Routing & Navigation)
* **Axios** (HTTP Client & Interceptors)
* **Tailwind CSS** (Styling)
* **Lucide React** (Icons)
* **jwt-decode** (Local Token Parsing)

---

## 📁 Project Structure

Here is a quick overview of the core files powering the authentication flow:

```text
src/
├── api.js                # Custom Axios instance with auto-refresh & 401 retry logic
├── pkce.js               # Cryptographic utilities for SHA-256 code challenge generation
├── SessionManager.jsx    # Headless component that refreshes tokens in the background
├── App.jsx               # Application router and layout wrapper
├── LoginPage.jsx         # UI for login form; initiates the PKCE flow
├── AuthorizedPage.jsx    # The OAuth2 callback route; exchanges the code for JWT tokens
└── Dashboard.jsx         # Protected route; decodes JWT to display user roles/features