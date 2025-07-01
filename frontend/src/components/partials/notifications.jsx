import axios from "axios";
import { useEffect,useState } from "react";

const Notification = (props) => {
    
    const [errorMsg, SetErrorMsg] = useState("");
    const [notificationed, setNotificationed] = useState()
    const [successMsg, setsuccessMsg] = useState("");
    const notifications = async(userId) => {
        try{
            const res = await axios.post("https://expense-splitter-45tz.onrender.com/getNotifications", {userId}, {withCredentials: true});
            console.log(res.data);
            setNotificationed(res.data)
        } catch(err) {
            console.log(err);
        }
    }

    const deleteRequest = async (notification_id, userId) => {
        console.log(userId)
        try{
            const res = await axios.delete("https://expense-splitter-45tz.onrender.com/deleteRequest", {data : {notification_id}}, {withCredentials: true});
            console.log(res.data);
            if(res.data){
                await notifications(userId);
            }
        } catch(err) {
            SetErrorMsg(err.response.data);
            setTimeout(() => {
                SetErrorMsg("");
            }, 1500)
        }
    }

    const acceptRequest = async (notification_id, userId, groupId) => {
        console.log(groupId)
        try{
            const res = await axios.post("https://expense-splitter-45tz.onrender.com/acceptRequest", {data: {userId, groupId}}, {withCredentials: true});
            
            await deleteRequest(notification_id, userId) ;
            setsuccessMsg(res.data);
            setTimeout(() => {
                setsuccessMsg("");
            }, 1500)
            {props.getData && await props.getData();}
        } catch(err) {
            console.log(err.response.data);
        }
    }



    const [open,setIsOpen] = useState(false);
    return(<>
    {!open&&<button onClick={() => {
                                setIsOpen(true);
                                notifications(props.userId);
                            }} 
                            className="bell-button"><svg viewBox="0 0 448 512" className="bell"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg></button>}

    <div className="Notification">
        {open&&<div className="Noti"> <p>Notifications</p>
        <button onClick={()=>setIsOpen((prev)=>!prev) } className="notification-close-btn">close</button>

        <div>
            {notificationed && notificationed.map((notify) =>
            <div key={notify.notification_id} className="request" >
                
                <p>You are invited to "{notify.message}"</p>

                <div className="notification-btn">
                    <button onClick={() => deleteRequest(notify.notification_id, props.userId)} className="delete">Delete</button>
                    <button onClick={() => acceptRequest(notify.notification_id, props.userId, notify.group_id)} className="accept">Join</button>
                </div>

                <p className="sender-detail">from {notify.sender_name}</p>

            </div>

            )}
            </div>
        </div>}
        
    </div>
    {successMsg && (<div className="success-card">{successMsg}</div>)}
    {errorMsg && (<div className="delete-card">{errorMsg}</div>)}
    </>);
}

export default Notification;
