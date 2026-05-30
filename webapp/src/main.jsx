import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ConferenceProvider } from "./context/ConferenceContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ConferenceProvider>
        <App />
      </ConferenceProvider>
    </AuthProvider>
  </StrictMode>,
);
