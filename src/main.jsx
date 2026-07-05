import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./assets/tailwind.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);