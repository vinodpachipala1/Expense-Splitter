import axios from "axios";
import { useState } from "react";
import { BASE_URL } from "../path";
const Home = (props) => {
    const [GroupName, setGroupName] = useState("");
    const [error, seterror] = useState("");
    const [successMsg, setsuccessMsg] = useState("");
    const handleChange = (e) =>{
        setGroupName(e.target.value);
        seterror("");
    }
    

    const createGroup = async () => {
        try{
            if(GroupName.trim().length >= 3){
                const res = await axios.post(`${BASE_URL}CreateGroup`,{id: props.user.id, GroupName: GroupName},{withCredentials: true});
                setsuccessMsg(res.data.message)
                
                if(res.data.id){
                    props.setGroup((prev)=>[...prev,{id: res.data.id, group_name: res.data.name}]);
                }
                setTimeout(() => {
                    setsuccessMsg("");
                }, 1500)
            }
            else{
                seterror("Name Must Be At Least 3 Characters.")
            }
        }
        catch(err){
            seterror(err.response.data);
        }
    }

    return (
    <div>
        
        <div className="homeContainer">
            {props.user && (<p>Welcome, {props.user.name}</p>)}
    
            <p className="title-tag">Fair, Fast Bill Splitting</p>
            <p>Create New Group</p>
            <input name="GroupName" onChange={handleChange} placeholder="Enter Group Name" ></input><br />
            <div className="error-create"><p>{error.length!==0&& error}</p></div>
            <div ><p>{successMsg.length!==0&& successMsg}</p></div>
            {successMsg && (<div className="success-card">{successMsg}</div>)}


            <button className="createBtn" onClick={createGroup}><span>
    <svg
        height="24"
        width="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M0 0h24v24H0z" fill="none"></path>
        <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z" fill="currentColor"></path>
    </svg>
    Create Group
    </span></button>
        </div>
    </div>
    );
};


export default Home;
