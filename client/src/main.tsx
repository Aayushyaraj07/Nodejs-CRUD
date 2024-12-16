import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/Global.scss"
import "antd/dist/reset.css"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      style={{
        maxWidth: "400px", // Max width for the toasts
        fontSize: "14px",  // Font size for the toasts
        padding: "10px",   // Padding inside the toasts
      }}
    />

    <App />
  </StrictMode>
);
