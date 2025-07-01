import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/login-form";
import styles from "./login.css";

const Login = () => {
    const navigate = useNavigate();
    
    const handleRegisterClick = () => {
        navigate("/register");
    };
    return(<div className="login-form">
            <div className="login-container">
        
                <p className="register-title">SplitBill</p>
                <p className="tagline">Fair, Fast Bill Splitting</p>
                <div className="login-detail">
                    <LoginForm />
                    <div>
                        Don’t have an account?{" "}
                        <span
                            onClick={handleRegisterClick}
                            style={{ color: "blue", textDecoration: "underline", cursor: "pointer" }}
                        >
                        Register
                    </span>
                </div>
            </div>
        </div>
    </div>)
}

export default Login;