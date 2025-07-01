import Home from "../../components/Home paritals/Home";
import axios from "axios";
import Footer from "../../components/partials/footer";
import Home2 from "../../components/Home paritals/Home2";
import Home3 from "../../components/Home paritals/Home3";
import { useNavigate } from "react-router-dom";
import Header from "../../components/partials/header";
import { useEffect, useState } from "react";
import styles from "./Home-page.css";
import { BASE_URL } from "../../components/path";



const HomePage = () => {
    const [user, setUser]= useState("");
    const [group, setGroup] = useState([]);
    const [groups, setGroups] = useState([]); // Accepted groups
    const [load, Setload] = useState(true);
    const [load1, Setload1] = useState(true);
    const [acceptedgroups, setAcceptedGroups] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const verify = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/verify`, {withCredentials: true});
                console.log(res.data.data);
                if(res.data.data){
                    setUser(res.data.data);
                    const res1 = await axios.post(`${BASE_URL}/getGroup`, {id: res.data.data.id}, {withCredentials: true});
                    Setload1(false);
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
            const res = await axios.post(`${BASE_URL}/getAcceptedGroups`,{userId: user.id}, {withCredentials: true});
            Setload(false);
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
        <Home2 userId = {user.id} group={group} setGroup={setGroup} load={load1}/>
    </div>}
    {acceptedgroups&&<div className="part2-Home">
        <Home3 userId = {user.id} group={groups} setGroup={setGroup} getData = {getData} load={load}/>
    </div>}
    <Footer />
    </>)
}

export default HomePage;