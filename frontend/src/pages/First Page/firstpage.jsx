import { useNavigate } from "react-router-dom";
import styles from "./FirstPage.css";
const FirstPage = () => {
    const navigate = useNavigate();

    const sign = (e) => {
        var name = e.target.name;
        if(name === "login"){
            navigate("/login");
        }
        else if(name === "signup"){
            navigate("/register");
        }
    }
    return(<div className="center-buttons">
        <div className="app-title">
        <h1 >SplitBill</h1>
        <p className="firstpage-tagline">Fair, Fast Bill Splitting</p>
        </div>
        <div className="first-page-container">
        
        <div className="button-group">
            <button onClick={sign} name="login" className="cursor-pointer w-40 bg-gradient-to-r from-[#8E2DE2] to-[#4A00E0] text-white px-8 py-3 rounded text-white font-semibold shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-10px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] focus:shadow-[inset_-12px_-8px_40px_#46464620] transition-shadow">
                Login
            </button>
        
            <button onClick={sign} name="signup" className="cursor-pointer w-40 bg-gradient-to-r from-[#EB3349] to-[#F45C43] px-7 py-1 rounded text-white font-semibold shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-10px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] focus:shadow-[inset_-12px_-8px_40px_#46464620] transition-shadow">
                Register
            </button>
        </div>
    </div>
    </div>)
}

export default FirstPage;