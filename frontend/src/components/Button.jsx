/* ──────────────────────────────────────────────────────────────────────────────
   File: src/components/Button.jsx  (simple variant helper)
   ────────────────────────────────────────────────────────────────────────────── */
export default function Button({ variant = "primary", className = "", ...props }) {
    const cls = ["button", variant === "outline" ? "outline" : variant === "danger" ? "danger" : "primary", className].join(" ");
    return <button {...props} className={cls.trim()} />;
}
