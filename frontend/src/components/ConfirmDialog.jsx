export default function ConfirmDialog({
    open,
    message = "Are you sure?",
    onConfirm,
    onCancel,
}) {
    if (!open) return null; // nothing rendered

    return (
        <div className="dialog-backdrop">
            <div className="dialog-card">
                <p>{message}</p>

                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", justifyContent: "center" }}>
                    <button className="button outline primary" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="button danger" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
