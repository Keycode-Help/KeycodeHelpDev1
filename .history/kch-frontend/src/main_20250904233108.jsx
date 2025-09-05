import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App";
import { setupGlobalErrorHandling } from "./utils/messageChannelHandler";

// import "./index.css"; // Removed - using Tailwind only

// Setup global error handling for message channel errors
setupGlobalErrorHandling();

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
