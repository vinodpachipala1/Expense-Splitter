import AddMember from "../../components/GroupDetails/AddMember-form";
import Header from "../../components/partials/header";
import Footer from "../../components/partials/footer";
import AddExpenses from "../../components/GroupDetails/AddExpense";
import Previous from "../../components/GroupDetails/previous";
import Active from "../../components/GroupDetails/active";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./view-page.css";
const AddGroupDetails = () => {
    const location = useLocation();

    const {groupId, group_name, display_addMember} = location.state || {};

    const [open , SetOpen] = useState(false);
    const members = () =>{
        SetOpen((prev) => !prev);
    }

    const [GroupMembers, SetGroupMembers] = useState([]);
    const [display, SetDisplay] = useState("addExpense");
    useEffect(()=>{ getMembers()},[])

    const getMembers = async () => {
        try {
            const res = await axios.post("http://localhost:3001/getGroupMembers", {groupId});
            console.log(res.data.members)
            SetGroupMembers(res.data.members);
        } catch (err) {
            console.log(err);
        }
    }

    return(<>
    <div className="Home-main">
        {<Header />}
    
        {display_addMember&&<AddMember />}
    <div className="view-group-members-btn">{<button onClick={ async () => { members(); await getMembers()}}>View Group Members</button>}</div>
    </div>
    <div className="members">
        {open && <div className="group-members">
            <div className="group-members-header">
                <p>Group Members</p>
                <button onClick={members}>X</button>
            </div>
            <div className="group-members-table">
                <table >
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>User Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {GroupMembers.map((member) => (
                            <tr key={member.user_id}>
                                <td>{member.name}</td>
                                <td>{member.username}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>}
    </div>
    <div>
        <div className="radio-view-page">

            <input type="radio" name="plan" id="glass-silver" checked = {display === "addExpense"} onChange={()=>SetDisplay("addExpense")}/>
            <label htmlFor="glass-silver">Add New Expense</label>

            <input type="radio" name="plan" id="glass-gold" onChange={()=>SetDisplay("activeSplits")}/>
            <label htmlFor="glass-gold">Active Expenses</label>

            <input type="radio" name="plan" id="glass-platinum" onChange={()=>SetDisplay("previousSplits")}/>
            <label htmlFor="glass-platinum">Expense History</label>

            <div className="glass-glider"></div>
        </div>
        
        {display === "addExpense" && <div className="AddExpense" ><AddExpenses /></div>} 
        {display === "activeSplits" && <div className="expenses-card" ><Active length = {GroupMembers.length} /> </div>}
        {display === "previousSplits" && <div className="expenses-card" > <Previous /> </div>}
    </div>
    <Footer />
    </>)
}

export default AddGroupDetails;