import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/register-form";
import styles from "./register.css";
const Register= () => {
    const navigate = useNavigate();

    const handleLoginClick = () =>{
        navigate("/login")
    }

    return (<div className="registeration-form">
        <div className="container">
        
        <p className="register-title">SplitBill</p>
        <p className="tagline">Fair, Fast Bill Splitting</p>
        
        <div className="register-form">
        <RegisterForm />
        
        <div>Already have an account? {" "}
            <span onClick={handleLoginClick} style={{color: "blue", cursor:"pointer", textDecoration: "underline"}}>
                Login
            </span>
        </div>
        </div>
        </div>

    </div>)
}

export default Register;

