import { useNavigate } from "react-router-dom";

export default function LandingPage() {
    const navigate = useNavigate();
    return (
        <div>
            <button onClick={() => navigate("/login")}>Go to login/signup</button>
        </div>
    );
}