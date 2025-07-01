import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home2 = (props) => {

    const navigate = useNavigate();
    const [DeleterMsg, SetDeleteMsg] = useState("");
    const ondelete= async (id) => {
        try{
            const res = await axios.delete("https://expense-splitter-45tz.onrender.com/deleteGroup", {data: { id: id }}, {withCredentials: true})
            SetDeleteMsg(res.data);
            setTimeout(() => {
                SetDeleteMsg("");
            }, 1500)
            if(res.data){
                const newGroups = await props.group.filter(group => group.id != id);
                props.setGroup(newGroups);
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const veiwDetails = async(group) => {
        const id = group.id;
        const group_name = group.group_name;
        navigate("/ViewGroup", { state: { groupId: id, group_name ,userId: props.userId, display_addMember: true} });
    }

    return(
    <div className="groupcards">
        {props.group.length > 0 ? props.group.map((group) =>
            <div key={group.id} className="groupCard">

                <div className="groupTop">
                    <h2>{group.group_name}</h2>
                    <span className="badge active">Active</span>
                </div>

                <p className="groupDescription">
                    Manage all expenses, add members, and review your split history easily.
                </p>

                <div className="groupActions">
                    <button onClick={()=>veiwDetails(group)} className="viewBtn">View</button>
                    <button onClick={()=>ondelete(group.id)} className="deleteBtn">Delete Group</button>
                </div>

            </div>
        ) : <p className="empty">You don’t have any groups at the moment. Create one to get started!</p>}

        {DeleterMsg && (<div className="delete-card">{DeleterMsg}</div>)}
    </div>

) }

export default Home2;