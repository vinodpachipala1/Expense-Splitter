import Home from "../../components/Home paritals/Home";
import axios from "axios";
import Footer from "../../components/partials/footer";
import Home2 from "../../components/Home paritals/Home2";
import Home3 from "../../components/Home paritals/Home3";
import { useNavigate } from "react-router-dom";
import Header from "../../components/partials/header";
import { useEffect, useState } from "react";
import styles from "./Home-page.css";


const HomePage = () => {
    const [user, setUser]= useState("");
    const [group, setGroup] = useState([]);

    const [groups, setGroups] = useState([]); // Accepted groups

    const [acceptedgroups, setAcceptedGroups] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get("https://expense-splitter-45tz.onrender.com/verify", {withCredentials: true});
                console.log(res.data.data);
                if(res.data.data){
                    setUser(res.data.data);
                    const res1 = await axios.post("https://expense-splitter-45tz.onrender.com/getGroup", {withCredentials: true, id: res.data.data.id});
                    if(res1.data.data){
                        setGroup(res1.data.data);
                    }
                }
            } catch (err) {
                console.error("Verification error:", err);
            }
        };
        verify();
    },[]);

    const getData = async () => {
        try {
            const res = await axios.post("https://expense-splitter-45tz.onrender.com/getAcceptedGroups",{withCredentials: true, userId: user.id})
            const groups = res.data.accepted_groups;
            setGroups(groups.filter(group => group.created_user_id != user.id));
        } catch (err) {
            
        }
    };

    return(<>
    
    <div className="Home-main" >
        <Header getData = {getData} />
        <Home user = {user} setGroup={setGroup} getData = {getData}/>
    </div>

    <div className="glass-radio-group">
        <input type="radio" name="plan" id="glass-silver" checked={!acceptedgroups} onChange={() => setAcceptedGroups(false)} />
        <label htmlFor="glass-silver">Created</label>

        <input type="radio" name="plan" id="glass-gold" onChange={() => setAcceptedGroups(true)}/>
        <label htmlFor="glass-gold">Joined</label>

        <div className="glass-glider"></div>
    </div>




    {!acceptedgroups&&<div className="part2-Home">
        <Home2 userId = {user.id} group={group} setGroup={setGroup} />
    </div>}
    {acceptedgroups&&<div className="part2-Home">
        <Home3 userId = {user.id} group={groups} setGroup={setGroup} getData = {getData} />
    </div>}
    <Footer />
    </>)
}

export default HomePage;