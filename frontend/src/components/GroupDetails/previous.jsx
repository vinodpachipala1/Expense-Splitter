import axios from "axios";
import { useState , useEffect} from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../path";
const Previous =  () => {
    const location = useLocation();
    const [SettledExpenses, SetSettledExpenses] = useState([]);
    const {groupId, userId} = location.state || {};
    const [view, SetView] = useState();
    const [load, Setload] = useState(true)
    useEffect(() => {
        const settled = async () => {
            try{
                const res = await axios.post(`${BASE_URL}/getExpenseHistory`, {groupId});
                SetSettledExpenses(res.data);
                Setload(false);
            } catch (err){
            }
        }
        settled();
    }, [groupId])
    return(<div>
        {!load ? SettledExpenses.length > 0 ? <div>
            {SettledExpenses.map((expense) => (
                <div key={expense.id} className="expensesCard">
                    <div className="card-header">
                        <h3 className="expense-title">{expense.name}</h3>
                        <span className={`amount-pill ${view === expense.id ? 'detailed' : ''}`}>
                            ₹{expense.amount * expense.members_count}
                        </span>
                    </div>
    
                    <p className="paid-by">
                        <span className="label">Paid by:</span>
                        <span className="payer">{expense.names.map(JSON.parse).find(user => user.user_id === userId)?.name === expense.paye_name ?  "You" : expense.paye_name}</span>
                    </p>

    
                    {expense.description && (
                        <p className="description">
                            <span className="label">Description:</span>
                            {expense.description}
                        </p>
                    )}
    
                    {view === expense.id && (
                    <div className="breakdown-section">
                        <table className="breakdown-table">
                            <tbody>
                                {expense.names.map(JSON.parse).find(user => user.user_id === userId)?.name && <tr className="breakdown-row you-row">
                                    <td className="member-name">You</td>
                                    <td className="member-amount">₹{(expense.amount)}</td>
                                </tr>}
                                {expense.names.length > 0 && expense.names.map(name => typeof name === 'string' ? JSON.parse(name) : name).filter(member => member.user_id != userId).map(member => (
                                    <tr key={member.user_id}className="breakdown-row">
                                        <td className="member-name">{member.name}</td>
                                        <td className="member-amount">₹{(expense.amount)}</td>
                                    </tr>
                                ))}
                                <tr className="total-row">
                                    <th className="total-label">Total:</th>
                                    <td className="total-amount">₹{expense.members_count * expense.amount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
    
                <div className="card-actions">
                    <div>
                    <div className="settled-and-Created">
                    <p>
                        <span>Created on:</span>
                        <span>{expense.created_on.split("T")[0]}</span>
                    </p>
                    <p className="Created-on">
                        <span>Settled on:</span>
                        <span>{expense.created_at.split("T")[0]}</span>
                    </p>
                    </div>
                    </div>
                    <button
                        onClick={() => view === expense.id ? SetView() : SetView(expense.id)}
                        className={`w-32 h-12 rounded-md text-white font-semibold shadow-lg transition duration-200 hover:scale-105
                        ${view === expense.id ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                        >
                        {view === expense.id ? "Close Details" : "Breakdown"}
                    </button>
                </div>
            </div>
            ))}
        </div> : <p className="empty">You have no expense history yet.</p> : <div className="load-container"><div class="loader"></div></div>}
    </div>)
}

export default Previous;