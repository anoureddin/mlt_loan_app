// /* ──────────────────────────────────────────────────────────────────────────────
//    File: src/pages/EdaSummaryPage.jsx
//    ────────────────────────────────────────────────────────────────────────────── */
// import { useEffect, useState } from "react";
// import { api } from "../lib/api";
// import Button from "../components/Button";
// import Spinner from "../components/Spinner";

// export default function EdaSummaryPage() {
//     const [cleaned, setCleaned] = useState(true);
//     const [data, setData] = useState(null);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const run = async () => {
//             try {
//                 setError(null); setData(null);
//                 setData(cleaned ? await api.edaSummary() : await api.edaRaw());
//             } catch (err) {
//                 setError(err.message);
//             }
//         };
//         run();
//     }, [cleaned]);

//     if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;
//     if (!data) return <Spinner />;

//     return (
//         <div className="card">
//             <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
//                 <Button variant={cleaned ? "primary" : "outline"} onClick={() => setCleaned(true)}>Cleaned</Button>
//                 <Button variant={!cleaned ? "primary" : "outline"} onClick={() => setCleaned(false)}>Raw</Button>
//             </div>
//             <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto", maxHeight: "70vh" }}>{JSON.stringify(data, null, 2)}</pre>
//         </div>
//     );
// }

import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";
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

export default function EdaSummaryPage() {
    const [cleaned, setCleaned] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    /* ─────────────────────────────────────────────────────────────
       Fetch either the cleaned or raw dataset summary from the API
    ────────────────────────────────────────────────────────────────*/
    useEffect(() => {
        const fetchData = cleaned ? api.edaSummary() : api.edaRaw();
        fetchData.then(setData).catch((e) => setError(e.message));
    }, [cleaned]);

    /* ─────────────────────────────────────────────────────────────
       Loading / error states
    ────────────────────────────────────────────────────────────────*/
    if (error) {
        return (
            <p className="container" style={{ color: "#dc2626" }}>
                Error: {error}
            </p>
        );
    }
    if (!data) {
        return (
            <div className="container">
                <Spinner />
            </div>
        );
    }

    /* ─────────────────────────────────────────────────────────────
       Chart for missing-value counts
    ────────────────────────────────────────────────────────────────*/
    const chartData = {
        labels: Object.keys(data.missing_per_column),
        datasets: [
            {
                label: "Missing",
                data: Object.values(data.missing_per_column),
                backgroundColor: "#dc262680",
                borderWidth: 1,
            },
        ],
    };

    const statOrder = ["count", "mean", "std", "min", "25%", "50%", "75%", "max"];

    return (
        <div className="container" style={{ padding: "1.5rem 0" }}>
            {/* Cleaned / Raw toggle */}
            <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem" }}>
                <Button
                    variant={cleaned ? "primary" : "outline"}
                    onClick={() => setCleaned(true)}
                >
                    Cleaned
                </Button>
                <Button
                    variant={!cleaned ? "primary" : "outline"}
                    onClick={() => setCleaned(false)}
                >
                    Raw
                </Button>
            </div>

            {/* Dataset size badge */}
            <p>
                <span className="badge">
                    {data.shape[0]} rows × {data.shape[1]} cols
                </span>
            </p>

            {/* Missing-value bar chart */}
            <div className="card" style={{ margin: "1rem 0" }}>
                <h3>Missing Values</h3>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } },
                    }}
                />
            </div>

            {/* Numerical summary table */}
            <div className="card">
                <h3>Numerical summary</h3>
                <table className="table" style={{ marginTop: ".5rem" }}>
                    <thead>
                        <tr>
                            <th>Variable</th>
                            {statOrder.map((s) => (
                                <th key={s}>{s}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(data.numerical_summary).map(([varName, vals]) => (
                            <tr key={varName}>
                                <td>{varName}</td>
                                {statOrder.map((s) => (
                                    <td key={s}>{vals[s]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Categorical summary (top 10 per column) */}
            <div style={{ marginTop: "1.5rem" }}>
                <h3>Categorical summary (top 10 values each)</h3>
                <div style={{ display: "grid", gap: "1rem" }}>
                    {Object.entries(data.categorical_summary).map(
                        ([colName, counts]) => (
                            <div
                                key={colName}
                                className="card"
                                style={{ padding: ".75rem" }}
                            >
                                <strong>{colName}</strong>
                                <table className="table" style={{ marginTop: ".25rem" }}>
                                    <thead>
                                        <tr>
                                            <td>Value</td>
                                            <td>Count</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(counts)
                                            .slice(0, 10)
                                            .map(([val, cnt]) => (
                                                <tr key={val}>
                                                    <td>{val}</td>
                                                    <td>{cnt}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
