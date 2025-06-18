import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";

import LandingPage from "./pages/LandingPage";
import LoanRequestsPage from "./pages/LoanRequestsPage";
import NewLoanRequestPage from "./pages/NewLoanRequestPage";
import EdaSummaryPage from "./pages/EdaSummaryPage";
import DataIssuesPage from "./pages/DataIssuesPage";
import ModelPerformancePage from "./pages/ModelPerformancePage";

export default function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* CRUD + analytics */}
        <Route path="/requests" element={<LoanRequestsPage />} />
        <Route path="/create" element={<NewLoanRequestPage />} />
        <Route path="/eda" element={<EdaSummaryPage />} />
        <Route path="/issues" element={<DataIssuesPage />} />
        <Route path="/metrics" element={<ModelPerformancePage />} />

        {/* fallback */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  );
}
