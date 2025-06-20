import React, { useState } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";
import Spinner from "../components/Spinner";

const OPTIONS = {
    gender: ["Male", "Female"],
    married: ["Yes", "No"],
    dependents: ["0", "1", "2", "3 or more"],
    education: ["Graduate", "Not Graduate"],
    self_employed: ["Yes", "No"],
    property_area: ["Urban", "Rural", "Semiurban"],
};

const defaultValues = {
    gender: "Male",
    married: "No",
    dependents: "0",
    education: "Graduate",
    self_employed: "No",
    applicant_income: "5000",
    coapplicant_income: "0",
    loan_amount: "200",
    loan_amount_term: "360",
    credit_history: "1",
    property_area: "Urban",
};

const labelize = (s) =>
    s
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

export default function NewLoanRequestPage() {
    const [values, setValues] = useState(defaultValues);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setValues({ ...values, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const payload = { ...values };
            if (payload.dependents === "3 or more") payload.dependents = "3+";

            [
                "applicant_income",
                "coapplicant_income",
                "loan_amount",
                "loan_amount_term",
                "credit_history",
            ].forEach((k) => (payload[k] = Number(payload[k])));

            const res = await api.createLoanRequest(payload);
            setResult(res);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const reset = () => {
        setResult(null);
        setValues(defaultValues);
    };

    // const prob = parseFloat(result.prediction_probability);       // 0-1
    // const isApproved = result.prediction === "Y";
    // const shownProb = isApproved ? prob : 1 - prob;               // إذا مرفوض نعرض 1-prob
    // const pct = (shownProb * 100).toFixed(1);

    if (submitting) return <Spinner />;

    return (
        <div className="container" style={{ padding: "1.5rem 0" }}>
            {!result ? (
                /* ─────────────── FORM ─────────────── */
                <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <form
                        onSubmit={handleSubmit}
                        style={{ display: "grid", gap: "1rem" }}
                    >
                        {Object.entries(values).map(([field, value]) => (
                            <div key={field}>
                                <label htmlFor={field}>{labelize(field)}</label>

                                {OPTIONS[field] ? (
                                    <select
                                        id={field}
                                        name={field}
                                        value={value}
                                        onChange={handleChange}
                                    >
                                        {OPTIONS[field].map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        id={field}
                                        name={field}
                                        value={value}
                                        onChange={handleChange}
                                    />
                                )}
                            </div>
                        ))}

                        <Button type="submit">Submit</Button>
                    </form>

                    {error && (
                        <p style={{ color: "#dc2626", marginTop: "1rem" }}>{error}</p>
                    )}
                </div>
            ) : (
                /* ─────────────── RESULT ─────────────── */
                <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <h3 style={{ marginTop: 0 }}>Result</h3>

                    <p>
                        <strong>Decision:&nbsp;</strong>
                        {(() => {
                            const probApprove = parseFloat(result.prediction_probability);
                            const isApproved = result.prediction === "Y";
                            const pct = (probApprove * 100).toFixed(1); // e.g. 49.7
                            return (
                                <>
                                    <span
                                        style={{
                                            textTransform: "uppercase",
                                            marginLeft: 10,
                                            fontWeight: 600,
                                            color: isApproved
                                                ? "var(--emerald-500)"
                                                : "var(--rose-500)",
                                        }}
                                    >
                                        {isApproved ? "Approved" : "Rejected"}
                                    </span>
                                    &nbsp;
                                    <em style={{ fontSize: "0.9rem" }}>
                                        (with probability of{" "}
                                        {isApproved ? "approval" : "rejection"} of {pct}%)
                                    </em>
                                </>
                            );
                        })()}
                    </p>

                    <table className="table" style={{ marginTop: "0.75rem" }}>
                        <tbody>
                            {Object.entries(result).map(
                                ([key, val]) => {
                                    if (key === "id") return null;             // only skip the DB id
                                    /* render probability as 1-decimal % */
                                    const shown =
                                        key === "prediction_probability"
                                            ? (parseFloat(val) * 100).toFixed(1) + "%"
                                            : String(val);

                                    return (
                                        <tr key={key}>
                                            <td>{labelize(key)}</td>
                                            <td>{shown}</td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>

                    <div style={{ marginTop: "1rem", textAlign: "right" }}>
                        <Button className="primary" onClick={reset}>
                            New Request
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
