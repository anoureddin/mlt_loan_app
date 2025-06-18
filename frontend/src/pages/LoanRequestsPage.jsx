/* ──────────────────────────────────────────────────────────────────────────────
   File: src/pages/LoanRequestsPage.jsx
   ────────────────────────────────────────────────────────────────────────────── */
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import ConfirmDialog from "../components/ConfirmDialog";

// /* snake_case → Title Case */
const labelize = (s) =>
    s
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

export default function LoanRequestsPage() {
    const [rows, setRows] = useState(null);
    const [error, setError] = useState(null);

    const load = async () => {
        try {
            setRows(null);
            setError(null);
            setRows(await api.listLoanRequests());
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => { load(); }, []);

    const [pendingId, setPendingId] = useState(null);

    const doDelete = async () => {
        try {
            await api.deleteLoanRequest(pendingId);
            setRows(rows.filter((r) => r.id !== pendingId));
        } catch (err) {
            alert(err.message);
        } finally {
            setPendingId(null);
        }
    };

    if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;
    if (!rows) return <Spinner />;

    return (
        <div className="card">
            <div style={{ overflowX: "auto" }}>
                <table className="table">
                    <thead>
                        <tr>
                            {Object.keys(rows[0] ?? {}).map((h) => (
                                // <th key={h}>{h.replaceAll("_", " ")}</th>
                                <th>
                                    {labelize(h)}
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                {Object.entries(row).map(([k, v]) => (
                                    <td key={k}>{String(v)}</td>
                                ))}
                                <td>
                                    <Button variant="danger" onClick={() => setPendingId(row.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ConfirmDialog
                    open={pendingId !== null}
                    message="Are you sure? Delete this request?"
                    onCancel={() => setPendingId(null)}
                    onConfirm={doDelete}
                />
            </div>
        </div>
    );
}


// import { useEffect, useState } from "react";
// import { api } from "../lib/api";
// import Button from "../components/Button";
// import Spinner from "../components/Spinner";

// /* snake_case → Title Case */
// const labelize = (s) =>
//     s
//         .replace(/_/g, " ")
//         .replace(/\b\w/g, (c) => c.toUpperCase());

// export default function LoanRequestsPage() {
//     const [rows, setRows] = useState(null);
//     const [error, setError] = useState("");

//     /* fetch once */
//     useEffect(() => {
//         api
//             .listLoanRequests()
//             .then(setRows)
//             .catch((e) => setError(e.message));
//     }, []);

//     const handleDelete = async (id) => {
//         if (!confirm("Delete this record?")) return;
//         try {
//             await api.deleteLoanRequest(id);
//             setRows(rows.filter((r) => r.id !== id));
//         } catch (err) {
//             alert(err.message);
//         }
//     };

//     /* states */
//     if (error)
//         return (
//             <p className="container" style={{ color: "#dc2626" }}>
//                 Error: {error}
//             </p>
//         );

//     if (!rows)
//         return (
//             <div className="container">
//                 <Spinner />
//             </div>
//         );

//     /* table */
//     return (
//         <div className="container" style={{ padding: "1.5rem 0", maxWidth: "100%" }}>
//             <div className="card">
//                 <table
//                     className="table"
//                     style={{ width: "100%", tableLayout: "fixed" }}
//                 >
//                     <thead>
//                         <tr>
//                             {Object.keys(rows[0]).map((h) => {
//                                 /* split header into lines */
//                                 const lines = labelize(h).split(" ");
//                                 return (
//                                     <th
//                                         key={h}
//                                         style={{
//                                             whiteSpace: "normal",
//                                             wordBreak: "break-word",
//                                             textAlign: "left",
//                                         }}
//                                     >
//                                         {lines.map((word, idx) => (
//                                             <span key={idx}>
//                                                 {word}
//                                                 {idx !== lines.length - 1 && <br />}
//                                             </span>
//                                         ))}
//                                     </th>
//                                 );
//                             })}
//                             <th style={{ whiteSpace: "normal" }}>
//                                 Actions
//                             </th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {rows.map((row) => (
//                             <tr key={row.id}>
//                                 {Object.entries(row).map(([k, v]) => (
//                                     <td
//                                         key={k}
//                                         style={{ whiteSpace: "normal", wordBreak: "break-word" }}
//                                     >
//                                         {String(v)}
//                                     </td>
//                                 ))}
//                                 <td>
//                                     <Button variant="danger" onClick={() => handleDelete(row.id)}>
//                                         Delete
//                                     </Button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }
