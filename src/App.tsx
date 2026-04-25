import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoyalPetClinicApp from "./pages/RoyalPetClinicApp";
import HealthCheck from "./pages/HealthCheck";

// Simplified ErrorBoundary since original was markdown-converted
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoyalPetClinicApp />} />
          <Route path="/health" element={<HealthCheck />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
