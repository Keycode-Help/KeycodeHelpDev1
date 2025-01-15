import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./index.css"; // General CSS for the entire app

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
