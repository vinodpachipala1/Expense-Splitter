import axios from "axios";
import { useNavigate } from "react-router-dom";
import Notification from "./notifications";
import { useEffect, useState } from "react";

const Header = (props) => {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get("http://localhost:3001/verify", {withCredentials: true});
                if(res.data.data){
                    setUser(res.data.data);
                } else {
                    alert("Please Login First");
                    navigate("/");
                }
            } catch (err) {
                console.error("Verification error:", err);
            }
        };
        verify();
    },[]);

    //logout
    const logout = async () => {
        const res = await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });
        navigate("/");
    }
    return (
    <div className="navbar">
        <span className="title">
            Split<span className="title-highlight">Bill</span>
        </span>
        <div className="header-btns">
            <Notification userId={user.id} getData={props.getData} />
            <button className="logout-btn" onClick={logout}>
                <span className="btn-text">Logout</span>
    
            </button>
        </div>
    </div>
    )
}

export default Header;