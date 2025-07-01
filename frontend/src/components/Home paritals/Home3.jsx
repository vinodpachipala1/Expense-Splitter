import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../path";
const Home3 = (props) => {

    const navigate = useNavigate();
    const groups = props.group
    const [DeleterMsg, SetDeleteMsg] = useState("");
    
    useEffect(() => {
        if (props.userId){
            props.getData();
        }
    }, [props.userId]);

    
    const ondelete= async (id) => {
        try{
            const res = await axios.delete(`${BASE_URL}/LeaveGroup`, {data: { id: id }}, {withCredentials: true})
            SetDeleteMsg(res.data);
            setTimeout(() => {
                SetDeleteMsg("");
            }, 1500)
            await props.getData();
        }
        catch(err){
            console.log(err);
        }
    }

    const veiwDetails = async(group) => {
        const id = group.group_id;
        const group_name = group.group_name;
        navigate("/ViewGroup", { state: { groupId: id, group_name ,userId: props.userId, display_addMember: false}});
    }

    return(
    <div className="groupcards">
        {!props.load ? groups.length > 0  ? groups.map((group) =>
            <div key={group.accepted_group_id} className="groupCard">

                <div className="groupTop">
                    <h2>{group.group_name}</h2>
                    <span className="badge active">Active</span>
                </div>

                <p className="groupDescription">
                    Manage all expenses, add members, and review your split history easily.
                </p>

                <div className="groupActions">
                    <button onClick={()=>veiwDetails(group)} className="viewBtn">View</button>
                    <button onClick={()=>ondelete(group.accepted_group_id)} className="deleteBtn">Leave Group</button>
                </div>

            </div>
        ) : <p className="empty">You're not part of any groups yet.</p> : <div className="group-load-container"><div class="loader"></div></div>}
        {DeleterMsg && (<div className="delete-card">{DeleterMsg}</div>)}
    </div>

)}

export default Home3;