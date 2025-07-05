import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../partials/header";
import { BASE_URL } from "../path";

const AddMember = (props) =>{

    const location = useLocation();
    const {groupId, group_name, userId} = location.state || {};
    const [error, SetError] = useState("");
    const [successMsg, setsuccessMsg] = useState("");
    

    const [input, setInput] = useState("");
    const handleOnChange = (e) => {
        setInput(e.target.value);
        SetError("");
    }
    
    const invite = async () => {
        
        try{
            if(input.trim().length != 0){
                const res = await axios.post(`${BASE_URL}/sendInvite`, {data: {groupId , input, group_name, sent_from: userId}}, {withCredentials: true} );
                setsuccessMsg(res.data);
                setTimeout(() => {
                    setsuccessMsg("");
                }, 1500)
            }
            else{
                SetError("Please Enter user name or mail id!")
            }
        } catch(err) {
            console.log(err);
            SetError(err.response.data);
        }
        
    }

    return(
    
        <div className="homeContainer">
            <div className="AddMemberCard">
                
                <h3>Add a Group Member</h3>

                <div className="inputSection">
                
                    <p className="invite-text">Invite by Email or User Name</p>
                    <input type="email" placeholder="Enter email or user name" onChange={handleOnChange} /><br/>
                    <div className="error-create"><p>{error.length!==0&&error}</p></div>
                    <button onClick={invite} className="create" >Add Member</button>
                </div>
            </div>
            {successMsg && (<div className="success-card">{successMsg}</div>)}
        </div>

    )
}

export default AddMember;






