import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import Spinner from "../components/Spinner";

export default function DataIssuesPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api
            .dataIssues()
            .then(setData)
            .catch((e) => setError(e.message));
    }, []);

    if (error) return <p className="container" style={{ color: "#dc2626" }}>Error: {error}</p>;
    if (!data) return <div className="container"><Spinner /></div>;

    return (
        <div className="container" style={{ padding: "1.5rem 0" }}>
            <h2>Raw‑data quality report <span className="badge">{data.issues_found} issue{data.issues_found !== 1 && "s"}</span></h2>

            {data.issues.length === 0 && <p>No issues found 🎉</p>}

            {data.issues.map((issue, idx) => (
                <div key={idx} className="card issue-card">
                    <h4>{issue.title}</h4>
                    <p><strong>Details:</strong> {issue.details}</p>
                    <p><strong>Suggestion:</strong> {issue.suggestion}</p>
                </div>
            ))}
        </div>
    );
}
