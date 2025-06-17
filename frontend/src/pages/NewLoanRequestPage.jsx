// /* ──────────────────────────────────────────────────────────────────────────────
//    File: src/pages/NewLoanRequestPage.jsx
//    ────────────────────────────────────────────────────────────────────────────── */
// import { useState } from "react";
// import { api } from "../lib/api";
// import Button from "../components/Button";
// import Spinner from "../components/Spinner";

// const defaultValues = {
//     Gender: "Male",
//     Married: "No",
//     Dependents: "0",
//     Education: "Graduate",
//     Self_Employed: "No",
//     ApplicantIncome: "5000",
//     CoapplicantIncome: "0",
//     LoanAmount: "200",
//     Loan_Amount_Term: "360",
//     Credit_History: "1",
//     Property_Area: "Urban",
// };

// export default function NewLoanRequestPage() {
//     const [values, setValues] = useState(defaultValues);
//     const [submitting, setSubmitting] = useState(false);
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState(null);

//     const onChange = (e) => setValues({ ...values, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitting(true);
//         setError(null);
//         try {
//             const res = await api.createLoanRequest(values);
//             setResult(res);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (submitting) return <Spinner />;

//     return (
//         <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
//             <form onSubmit={handleSubmit} className="form" style={{ display: "grid", gap: "1rem" }}>
//                 {Object.entries(values).map(([k, v]) => (
//                     <div key={k}>
//                         <label htmlFor={k}>{k.replaceAll("_", " ")}</label>
//                         <input id={k} name={k} value={v} onChange={onChange} />
//                     </div>
//                 ))}
//                 <Button type="submit">Submit</Button>
//             </form>
//             {error && <p style={{ color: "#dc2626", marginTop: "1rem" }}>{error}</p>}
//             {result && (
//                 <div style={{ marginTop: "1rem", background: "#f1f5f9", padding: "1rem", borderRadius: "0.5rem" }}>
//                     <strong>Model Decision:</strong>
//                     <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(result, null, 2)}</pre>
//                 </div>
//             )}
//         </div>
//     );
// }


// /* src/pages/NewLoanRequestPage.jsx */
// import React, { useState } from "react";
// import { api } from "../lib/api";
// import Button from "../components/Button";
// import Spinner from "../components/Spinner";

// // Serializer expects **snake_case** fields; align keys accordingly
// const defaultValues = {
//     gender: "Male",
//     married: "No",
//     dependents: "0",
//     education: "Graduate",
//     self_employed: "No",
//     applicant_income: "5000",
//     coapplicant_income: "0",
//     loan_amount: "200",
//     loan_amount_term: "360",
//     credit_history: "1",
//     property_area: "Urban",
// };

// export default function NewLoanRequestPage() {
//     const [values, setValues] = useState(defaultValues);
//     const [submitting, setSubmitting] = useState(false);
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState("");

//     const onChange = (e) =>
//         setValues({ ...values, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitting(true);
//         setError("");
//         setResult(null);
//         try {
//             // Convert obvious numeric fields to numbers before POSTing
//             const numericKeys = [
//                 "dependents",
//                 "applicant_income",
//                 "coapplicant_income",
//                 "loan_amount",
//                 "loan_amount_term",
//                 "credit_history",
//             ];
//             const payload = { ...values };
//             numericKeys.forEach((k) => (payload[k] = Number(payload[k])));
//             const res = await api.createLoanRequest(payload);
//             setResult(res);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (submitting) return <Spinner />;

//     return (
//         <div className="container" style={{ padding: "1.5rem 0" }}>
//             <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
//                 <form
//                     onSubmit={handleSubmit}
//                     style={{ display: "grid", gap: "1rem" }}
//                 >
//                     {Object.entries(values).map(([k, v]) => (
//                         <div key={k}>
//                             <label htmlFor={k}>{k.replace(/_/g, " ")}</label>
//                             <input
//                                 id={k}
//                                 name={k}
//                                 value={v}
//                                 onChange={onChange}
//                             />
//                         </div>
//                     ))}
//                     <Button type="submit">Submit</Button>
//                 </form>
//                 {error && (
//                     <p style={{ color: "#dc2626", marginTop: "1rem" }}>{error}</p>
//                 )}
//                 {result && (
//                     <div
//                         style={{
//                             marginTop: "1rem",
//                             background: "#f1f5f9",
//                             padding: "1rem",
//                             borderRadius: "0.5rem",
//                         }}
//                     >
//                         <strong>Model Decision:</strong>
//                         <pre style={{ whiteSpace: "pre-wrap" }}>
//                             {JSON.stringify(result, null, 2)}
//                         </pre>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


// /* src/pages/NewLoanRequestPage.jsx */
// import React, { useState } from "react";
// import { api } from "../lib/api";
// import Button from "../components/Button";
// import Spinner from "../components/Spinner";

// const defaultValues = {
//     gender: "Male",
//     married: "No",
//     dependents: "0",
//     education: "Graduate",
//     self_employed: "No",
//     applicant_income: "5000",
//     coapplicant_income: "0",
//     loan_amount: "200",
//     loan_amount_term: "360",
//     credit_history: "1",
//     property_area: "Urban",
// };

// export default function NewLoanRequestPage() {
//     const [values, setValues] = useState(defaultValues);
//     const [submitting, setSubmitting] = useState(false);
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState("");

//     const onChange = (e) =>
//         setValues({ ...values, [e.target.name]: e.target.value });

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitting(true);
//         setError("");
//         try {
//             const numericKeys = [
//                 "dependents",
//                 "applicant_income",
//                 "coapplicant_income",
//                 "loan_amount",
//                 "loan_amount_term",
//                 "credit_history",
//             ];
//             const payload = { ...values };
//             numericKeys.forEach((k) => (payload[k] = Number(payload[k])));
//             const res = await api.createLoanRequest(payload);
//             setResult(res);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const reset = () => {
//         setResult(null);
//         setValues(defaultValues);
//     };

//     if (submitting) return <Spinner />;

//     return (
//         <div className="container" style={{ padding: "1.5rem 0" }}>
//             {!result ? (
//                 /* ──────────────── FORM ──────────────── */
//                 <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
//                     <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem" }}>
//                         {Object.entries(values).map(([k, v]) => (
//                             <div key={k}>
//                                 <label htmlFor={k}>{k.replace(/_/g, " ")}</label>
//                                 <input id={k} name={k} value={v} onChange={onChange} />
//                             </div>
//                         ))}
//                         <Button type="submit">Submit</Button>
//                     </form>
//                     {error && (
//                         <p style={{ color: "#dc2626", marginTop: "1rem" }}>{error}</p>
//                     )}
//                 </div>
//             ) : (
//                 /* ─────────────── RESULT ─────────────── */
//                 <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
//                     <h3 style={{ marginTop: 0 }}>Result</h3>
//                     <p>
//                         <strong>Decision:&nbsp;</strong>
//                         <span style={{ color: result.prediction === "Y" ? "green" : "#dc2626" }}>
//                             {result.prediction === "Y" ? "Approved" : "Rejected"}
//                         </span>
//                     </p>
//                     <table className="table" style={{ marginTop: "0.75rem" }}>
//                         <tbody>
//                             {Object.entries(result).map(([k, v]) => (
//                                 k !== "prediction" && (
//                                     <tr key={k}>
//                                         <td>{k.replace(/_/g, " ")}</td>
//                                         <td>{String(v)}</td>
//                                     </tr>
//                                 )
//                             ))}
//                         </tbody>
//                     </table>
//                     <div style={{ marginTop: "1rem", textAlign: "right" }}>
//                         <Button variant="outline" onClick={reset}>
//                             New Request
//                         </Button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useState } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";
import Spinner from "../components/Spinner";

/* -------------------------------------------
   Dropdown option sets for categorical fields
------------------------------------------- */
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

/* Helper: “loan_amount_term” → “Loan Amount Term” */
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
                        <span
                            style={{
                                // color: result.prediction === "Y" ? "green" : "#dc2626",
                                color: result.prediction === "Y" ? "var(--emerald-500)" : "var(--rose-500)",
                            }}
                        >
                            {result.prediction === "Y" ? "Approved" : "Rejected"}
                        </span>
                    </p>

                    <table className="table" style={{ marginTop: "0.75rem" }}>
                        <tbody>
                            {Object.entries(result).map(
                                ([key, val]) =>
                                    key !== "id" && ( // ⚠️ hide only the ID
                                        <tr key={key}>
                                            <td>{labelize(key)}</td>
                                            <td>{String(val)}</td>
                                        </tr>
                                    )
                            )}
                        </tbody>
                    </table>

                    <div style={{ marginTop: "1rem", textAlign: "right" }}>
                        <Button variant="outline" onClick={reset}>
                            New Request
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
