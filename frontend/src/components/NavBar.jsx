import { Link, NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Home", end: true },
    { to: "/requests", label: "Requests" },
    { to: "/create", label: "New Request" },
    { to: "/eda", label: "EDA" },
    { to: "/issues", label: "Data Issues" },
    { to: "/metrics", label: "Metrics" },
];

export default function NavBar() {
    return (
        <nav className="navbar">
            <div className="container nav-inner">
                <Link to="/" className="brand">
                    <img src="/logo.png" alt="Loan approval logo" />
                    Loan Approval
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
