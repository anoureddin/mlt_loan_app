// /* ──────────────────────────────────────────────────────────────────────────────
//    File: src/pages/ModelPerformancePage.jsx
//    ────────────────────────────────────────────────────────────────────────────── */
// import { useEffect, useState } from "react";
// import { api } from "../lib/api";
// import { Spinner } from "../components/Spinner";

// export default function ModelPerformancePage() {
//     const [data, setData] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const run = async () => {
//             try { setData(await api.modelPerformance()); }
//             catch (err) { setError(err.message); }
//         };
//         run();
//     }, []);

//     if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;
//     if (!data) return <Spinner />;

//     return (
//         <div className="card">
//             <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto", maxHeight: "70vh" }}>{JSON.stringify(data, null, 2)}</pre>
//         </div>
//     );
// }

// src/pages/ModelPerformancePage.jsx
import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Spinner from "../components/Spinner";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ModelPerformancePage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .modelPerformance()
            .then(setData)
            .catch((e) => setError(e.message));
    }, []);

    if (error) return <p className="container">Error: {error}</p>;
    if (!data) return <div className="container"><Spinner /></div>;

    // ── tidy duplicates (same model appears twice in the CSVs) ───────────────────
    const unique = [];
    const seen = new Set();
    for (const row of data.models) {
        const key = row.Model;
        if (!seen.has(key)) {
            unique.push(row);
            seen.add(key);
        }
    }

    // ── chart data ──────────────────────────────────────────────────────────────
    const chartData = {
        labels: unique.map((m) => m.Model),
        datasets: [
            {
                label: "F1-score",
                data: unique.map((m) => m.F1),
                backgroundColor: "#2563eb80",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container" style={{ padding: "1.5rem 0" }}>
            <h2>Model comparison (<code>{data.best_model}</code> is best)</h2>

            <div className="card" style={{ marginBottom: "1.5rem" }}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: { beginAtZero: true, ticks: { precision: 2 } },
                        },
                    }}
                />
            </div>

            <div className="card" style={{ overflowX: "auto" }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Model</th>
                            <th>Accuracy</th>
                            <th>Precision</th>
                            <th>Recall</th>
                            <th>F1</th>
                            <th>AUC</th>
                        </tr>
                    </thead>
                    <tbody>
                        {unique.map((m) => (
                            <tr
                                key={m.Model}
                                style={
                                    m.Model === data.best_model
                                        ? { background: "#e0edff" }
                                        : undefined
                                }
                            >
                                <td>{m.Model}</td>
                                <td>{m.Accuracy}</td>
                                <td>{m.Precision}</td>
                                <td>{m.Recall}</td>
                                <td>{m.F1}</td>
                                <td>{m.AUC}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p style={{ fontSize: "0.8rem", marginTop: "0.5rem" }}>
                Source files:&nbsp;
                {data.source_files.map((f) => (
                    <code key={f}>{f}&nbsp;</code>
                ))}
            </p>
        </div>
    );
}
