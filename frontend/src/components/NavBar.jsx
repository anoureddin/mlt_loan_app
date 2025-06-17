// /* ──────────────────────────────────────────────────────────────────────────────
//    File: src/components/NavBar.jsx
//    ────────────────────────────────────────────────────────────────────────────── */
// import { Link, NavLink } from "react-router-dom";

// export default function NavBar() {
//     return (
//         <nav className="navbar">
//             <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                 <Link to="/" style={{ fontWeight: 600 }}>Loan Approval Demo</Link>
//                 <div>
//                     <NavLink to="/" end>Requests</NavLink>
//                     <NavLink to="/create">New Request</NavLink>
//                     <NavLink to="/eda">EDA</NavLink>
//                     <NavLink to="/issues">Data Issues</NavLink>
//                     <NavLink to="/metrics">Metrics</NavLink>
//                 </div>
//             </div>
//         </nav>
//     );
// }


import { Link, NavLink } from "react-router-dom";

export default function NavBar() {
    const links = [
        { to: "/", label: "Requests", end: true },
        { to: "/create", label: "New Request" },
        { to: "/eda", label: "EDA" },
        { to: "/issues", label: "Data Issues" },
        { to: "/metrics", label: "Metrics" },
    ];

    return (
        <nav className="navbar">
            <div className="container nav-inner">
                <Link to="/" className="brand">
                    Loan Approval App
                </Link>

                <ul className="nav-items">
                    {links.map(({ to, label, end }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    isActive ? "nav-link active" : "nav-link"
                                }
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

