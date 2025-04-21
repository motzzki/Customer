//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import  {AuthProvider}  from "./auth/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <App />
    </AuthProvider>
);
