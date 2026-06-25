import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import OrganizationsPage from "./pages/OrganizationsPage.jsx";
import PlansPage from "./pages/PlansPage.jsx";

export default function App() {
  return (
    <div className="sa-app-container">
      <Sidebar />
      <div className="sa-content">
        <main className="sa-main">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
