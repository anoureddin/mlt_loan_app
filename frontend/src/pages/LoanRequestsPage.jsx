import { useEffect, useState } from "react";
import { api } from "../lib/api";
import Button from "../components/Button";
import Spinner from "../components/Spinner";
import ConfirmDialog from "../components/ConfirmDialog";

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
                                {Object.entries(row).map(([key, val]) => {
                                    let shown;

                                    if (key === "prediction_probability") {
                                        const num = val != null && !isNaN(parseFloat(val))
                                            ? parseFloat(val)
                                            : null;

                                        shown = num !== null
                                            ? `${(num * 100).toFixed(1)}%`
                                            : "N/A";
                                    } else {
                                        shown = val != null
                                            ? String(val)
                                            : "";
                                    }
                                    return <td key={key}>{shown}</td>;
                                })}

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
