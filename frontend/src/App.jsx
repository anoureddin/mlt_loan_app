// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


/* ──────────────────────────────────────────────────────────────────────────────
   File: src/App.jsx
   ────────────────────────────────────────────────────────────────────────────── */
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoanRequestsPage from "./pages/LoanRequestsPage";
import NewLoanRequestPage from "./pages/NewLoanRequestPage";
import EdaSummaryPage from "./pages/EdaSummaryPage";
import DataIssuesPage from "./pages/DataIssuesPage";
import ModelPerformancePage from "./pages/ModelPerformancePage";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <NavBar />
      <main className="container" style={{ padding: "2rem 0", flex: 1 }}>
        <Routes>
          <Route path="/" element={<LoanRequestsPage />} />
          <Route path="/create" element={<NewLoanRequestPage />} />
          <Route path="/eda" element={<EdaSummaryPage />} />
          <Route path="/issues" element={<DataIssuesPage />} />
          <Route path="/metrics" element={<ModelPerformancePage />} />
        </Routes>
      </main>
    </div>
  );
}
