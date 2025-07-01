import {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoEye } from "react-icons/io5";
import { FaRegUser, FaRegUserCircle, FaRegEyeSlash } from "react-icons/fa";
import { BASE_URL } from "./path";
const LoginForm = () => {
    const navigate = useNavigate();
    const [log, setLog] = useState({
        email: "",
        password: "",
        });

        const [password, setpassword] = useState("password");
        const [error, SetError] = useState("");

        const handleChange= (e) => {
            const {name, value} = e.target;
            setLog((prev) => ({
                ...prev, [name]: value}));
            SetError("");
        }

        const login = async (e) => {
            e.preventDefault();
            try{
                console.log(BASE_URL)
                const result = await axios.post(`${BASE_URL}/login`, { log:log }, { withCredentials: true });
                
                if (result.data.redirect) {
                    navigate(result.data.redirect);
                }
            } catch(err) {
                SetError("Invalid credentials!")
            }
        }
    return <div>
        <p>Email: </p><input type="email" onChange={handleChange} name="email" placeholder="Enter User Email"  required></input> <br></br>
        <p>Password: </p>
        <div className="input-wrapper">
            <input type={password} onChange={handleChange} name="password" placeholder="Enter User Password"></input><br />
            {password === "password" && <IoEye onClick={() => {setpassword("text")}} className="view-icon"/>}
            {password !== "password" && <FaRegEyeSlash onClick={() => {setpassword("password")}} className="view-icon"/>}
        </div>
        <div className="login-error">{error.length!==0&&error}</div>

        <button onClick={login} name="login" className="cursor-pointer w-32 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white px-8 py-3 rounded text-white font-semibold shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-10px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] focus:shadow-[inset_-12px_-8px_40px_#46464620] transition-shadow">
                Login
            </button>
    </div>
}

export default LoginForm;