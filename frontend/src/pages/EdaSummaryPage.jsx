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

const labelize = (s) =>
    s
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

export default function EdaSummaryPage() {
    const [cleaned, setCleaned] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    /* fetch either /eda-summary/ or /eda-raw/ */
    useEffect(() => {
        (cleaned ? api.edaSummary() : api.edaRaw())
            .then(setData)
            .catch((e) => setError(e.message));
    }, [cleaned]);

    if (error)
        return (
            <p className="container" style={{ color: "#dc2626" }}>
                Error: {error}
            </p>
        );
    if (!data)
        return (
            <div className="container">
                <Spinner />
            </div>
        );

    /* chart data with prettified labels */
    const chartData = {
        labels: Object.keys(data.missing_per_column).map(labelize),
        datasets: [
            {
                label: "Missing",
                data: Object.values(data.missing_per_column),
                backgroundColor: "#dc262680",
            },
        ],
    };

    const statCols = ["count", "mean", "std", "min", "25%", "50%", "75%", "max"];

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

            <p>
                <span className="badge">
                    {data.shape[0]} rows × {data.shape[1]} cols
                </span>
            </p>

            {/* Missing-value chart */}
            <div className="card" style={{ margin: "1rem 0" }}>
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } },
                    }}
                />
            </div>

            {/* Numerical summary */}
            <div className="card">
                <h3>Numerical summary</h3>
                <table className="table" style={{ marginTop: ".5rem" }}>
                    <thead>
                        <tr>
                            <th>Variable</th>
                            {statCols.map((c) => (
                                <th key={c}>{c}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(data.numerical_summary).map(([varName, vals]) => (
                            <tr key={varName}>
                                <td>{labelize(varName)}</td>
                                {statCols.map((c) => (
                                    <td key={c}>{vals[c]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Categorical summary */}
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
                                <strong>{labelize(colName)}</strong>
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
