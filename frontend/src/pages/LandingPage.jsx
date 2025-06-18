import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <section className="hero">
            <div className="hero-inner">
                <h1>Loan Approval</h1>

                <p>
                    Submit a loan application and instantly see whether our
                    machine-learning model approves it. Browse past requests,
                    inspect data quality, and compare model performance — all in one
                    lightweight app.
                </p>

                <Button onClick={() => navigate("/requests")} className="hero-cta">
                    View&nbsp;All&nbsp;Requests
                </Button>
            </div>
        </section>
    );
}
