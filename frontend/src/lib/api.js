/* ──────────────────────────────────────────────────────────────────────────────
   File: src/lib/api.js  (tiny wrapper around fetch)
   ────────────────────────────────────────────────────────────────────────────── */
const baseURL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

// async function request(path, options = {}) {
//     const res = await fetch(`${baseURL}${path}`, {
//         headers: { "Content-Type": "application/json" },
//         ...options,
//     });
//     if (!res.ok) {
//         const msg = await res.text();
//         throw new Error(msg || res.statusText);
//     }
//     return res.status === 204 ? null : await res.json();
// }

async function request(path, options = {}) {
    console.log("FETCH", baseURL + path);          // 👈
    try {
        const res = await fetch(`${baseURL}${path}`, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });
        console.log("STATUS", res.status);           // 👈
        if (!res.ok) throw new Error(await res.text() || res.statusText);
        const data = res.status === 204 ? null : await res.json();
        console.log("DATA", data);                   // 👈
        return data;
    } catch (err) {
        console.error("FETCH ERR", err);             // 👈
        throw err;
    }
}

export const api = {
    listLoanRequests: () => request("/requests/"),
    createLoanRequest: (payload) => request("/requests/", { method: "POST", body: JSON.stringify(payload) }),
    deleteLoanRequest: (id) => request(`/requests/${id}/`, { method: "DELETE" }),
    edaSummary: () => request("/eda/"),
    edaRaw: () => request("/eda/raw/"),
    dataIssues: () => request("/report/"),
    modelPerformance: () => request("/metrics/"),
};