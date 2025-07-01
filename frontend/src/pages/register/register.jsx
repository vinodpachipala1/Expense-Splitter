import { useNavigate } from "react-router-dom";
import {useState} from "react";
import axios from "axios";
import styles from "./register.css";
import { FaRegUser, FaRegUserCircle, FaRegEyeSlash } from "react-icons/fa";
import { IoIosPhonePortrait } from "react-icons/io";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { BASE_URL } from "../../components/path";
const Register= () => {
    const navigate = useNavigate();

    const handleLoginClick = () =>{
        navigate("/login")
    }

    const [errors,setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
        server: ""
    });

    const [reg, setReg] = useState({
        name: "",
        email: "",
        phone: "",
        username: "",
        password: "",
    });

    const [successMsg, setSuccessMsg] = useState("");

    const [password, setpassword] = useState("password");
    
    const [errorMsg, SetErrorMsg] = useState("");

    const handleChange= (e) => {
        const {name, value} = e.target;
        setReg((prev) => ({
            ...prev, [name]: value}));
        setErrors((prev) => ({
            ...prev, [name]: ""}));
    }


    const verify = ()=>{
        var isTrue = true;
        
        if(reg.name.length==0 || !/^[A-Za-z][A-Za-z ]*$/.test(reg.name)){
            isTrue=false;
            setErrors((prev)=>({...prev,name:"Name must contain letters only!"}))
        }
        if(reg.email.length==0 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reg.email)){
            isTrue=false;
            setErrors((prev)=>({...prev,email:"Invalid email format"}))
        }
        if(reg.username.length<6 || reg.username.length>8 || !/^[A-Za-z0-9]+$/.test(reg.username)){
            isTrue=false;
            setErrors((prev)=>({...prev,username:"Username must be 6-8 character. Only numbers and letters!"}))
        }
        if(reg.phone.length==0 || !/^\d{10}$/.test(reg.phone)){
            isTrue=false;
            setErrors((prev)=>({...prev,phone:"Phone number must be 10 digits"}))
        }
        if(reg.password.length==0 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(reg.password)){
            isTrue=false;
            setErrors((prev)=>({...prev,password:"At least 8 characters, uppercase, lowercase, number, and special character"}))
        }
        return isTrue;
    }

    const Register = async (e) => {
        e.preventDefault();
        if(verify()){
            try{
                const res = await axios.post(`${BASE_URL}/register`, {reg : reg});
                console.log(res.data);
                setSuccessMsg(res.data.message);
                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } catch (err){
                if(err.response.data.type === "server"){
                    SetErrorMsg(err.response.data.error);
                    setTimeout(() => {
                        SetErrorMsg("");
                    }, 1500)
                }
                
                setErrors((prev) => ({
                    ...prev, [err.response.data.type]: err.response.data.error}));
                console.log(err);
            }
        }
    }


    return (<div className="registeration-form">
        <div className="container">
        
        <p className="register-title">SplitBill</p>
        <p className="tagline">Fair, Fast Bill Splitting</p>
        
        <div className="register-form">
        
        {/* Registration Form */}

        <div>
        <div className="input-wrapper">
            <div className="icon-box">
                <FaRegUser />
            </div>
            <input type="text" onChange={handleChange} name="name" placeholder="Enter Your Name" required></input> <br></br>
        </div>
        <div className="error"><p>{errors.name.length!==0&&errors.name}</p></div>

        <div className="input-wrapper">
            <div className="icon-box">
                <FaRegUserCircle />
            </div>
            
            <input type="text" onChange={handleChange} name="username" placeholder="Create User Name" required></input> <br></br>
        </div>
        <div className="error"><p>{errors.username.length!==0&&errors.username}</p></div>

        <div className="input-wrapper">
            <div className="icon-box">
                <MdOutlineEmail />
            </div>
            <input type="email" onChange={handleChange} name="email" placeholder="Enter User Email" required></input> <br></br>
        </div>
        <div className="error"><p>{errors.email.length!==0&&errors.email}</p></div>
        
        <div className="input-wrapper">
            <div className="icon-box">
                <IoIosPhonePortrait />
            </div>
            <input type="phone" onChange={handleChange} name="phone" placeholder="Enter User Phone Number" required></input> <br></br>
        </div>
        <div className="error"><p>{errors.phone.length!==0&&errors.phone}</p></div>
        
        <div className="input-wrapper">
            <div className="icon-box">
                <RiLockPasswordLine />
            </div>
            <input type={password} onChange={handleChange} name="password" placeholder="Enter User Password" required></input> <br></br>
            {password === "password" && <IoEye onClick={() => {setpassword("text")}} className="view-icon"/>}
            {password !== "password" && <FaRegEyeSlash onClick={() => {setpassword("password")}} className="view-icon"/>}
        </div>
        <div className="error"><p>{errors.password.length!==0&&errors.password}</p></div>
        {successMsg && <p className="reg-Success">{successMsg}</p>}
        <button onClick={Register} name="signup" className="cursor-pointer w-32 bg-gradient-to-r from-[#EB3349] to-[#F45C43] px-7 py-1 rounded text-white font-semibold shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-10px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] focus:shadow-[inset_-12px_-8px_40px_#46464620] transition-shadow">
                Register
            </button>
    </div >

    {/* completed */}
        
        <div>Already have an account? {" "}
            <span onClick={handleLoginClick} style={{color: "blue", cursor:"pointer", textDecoration: "underline"}}>
                Login
            </span>
        </div>
        </div>
        </div>
        {errorMsg && (<div className="delete-card">{errorMsg}</div>)}
    </div>)
}

export default Register;

