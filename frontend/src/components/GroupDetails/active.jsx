import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Active = (props) => {
  const location = useLocation();
  const [activeExpenses, SetExpenses] = useState([]);
  const { groupId, userId } = location.state || {};
  const [groupMembers, SetMembers] = useState([]);
  const [view, SetView] = useState();
  const [DeleterMsg, SetDeleteMsg] = useState("");
  const [successMsg, setsuccessMsg] = useState("");

  useEffect(() => {
    active();
  }, [groupId]);

  const active = async () => {
    try {
      const res = await axios.post("https://expense-splitter-45tz.onrender.com/getActiveExpenses", {
        groupId,
      });
      SetExpenses(res.data.expenses);
      const mem = res.data.members;
      SetMembers(mem);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteExpense = async (ExpenseId, type) => {
    try {
      const res = await axios.delete("https://expense-splitter-45tz.onrender.com/deleteExpense", {
        data: { ExpenseId },
      });
      if(type === "delete")
        {SetDeleteMsg(res.data);
        setTimeout(() => {
            SetDeleteMsg("");
        }, 1500)}
      await active();
    } catch (err) {

    }
  };

  const settle = async (
    ExpenseId,
    expense,
    amount_per_person,
    members_count,
    groupmembers
  ) => {
    try {
      const res = await axios.post("https://expense-splitter-45tz.onrender.com/Settle", {
        expense,
        amount_per_person,
        groupmembers,
        members_count,
      });
      setsuccessMsg(res.data);
      setTimeout(() => {
        setsuccessMsg("");
      }, 1500)
      await deleteExpense(ExpenseId, "settle");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {activeExpenses.length > 0 ? (
        <div>
          {activeExpenses.map((expense) => (
            <div key={expense.id} className="expensesCard">
              <div className="card-header">
                <h3 className="expense-title">{expense.name}</h3>
                <span
                  className={`amount-pill ${
                    view === expense.id ? "detailed" : ""
                  }`}
                >
                  ₹{expense.amount}
                </span>
              </div>

              <p className="paid-by">
                <span className="label">Paid by:</span>
                <span className="payer">
                  {expense.paid_by != userId ? expense.paye_name : "You"}
                </span>
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
                      <tr className="breakdown-row you-row">
                        <td className="member-name">You</td>
                        <td className="member-amount">
                          ₹{(expense.amount / props.length).toFixed(2)}
                        </td>
                      </tr>
                      {groupMembers.length > 0 &&
                        groupMembers
                          .filter(
                            (member) =>
                              member.expense_id === expense.id &&
                              member.user_id != userId
                          )
                          .map((member) => (
                            <tr key={member.name} className="breakdown-row">
                              <td className="member-name">{member.name}</td>
                              <td className="member-amount">
                                ₹{(expense.amount / props.length).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                      <tr className="total-row">
                        <th className="total-label">Total:</th>
                        <td className="total-amount">₹{expense.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="card-actions">
                <div>
                  <p className="Created-on">
                    <span>Created on:</span>
                    <span>{expense.created_at.split("T")[0]}</span>
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      view === expense.id ? SetView() : SetView(expense.id)
                    }
                    className={`w-32 h-12 rounded-md text-white font-semibold shadow-lg transition duration-200 hover:scale-105
                    ${view === expense.id ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}`}
                    >
                    {view === expense.id ? "Close Details" : "Breakdown"}
                  </button>
                  {expense.paid_by == userId && (
                    <button
                      onClick={() => {
                        settle(
                          expense.id,
                          expense,
                          expense.amount / props.length,
                          props.length,
                          groupMembers.map((member) => ({
                            name: member.name,
                            user_id: member.user_id,
                          }))
                        );
                      }}
                      className="w-32 h-12 rounded-md bg-green-600 text-white font-semibold shadow-lg hover:bg-green-700 hover:scale-105 transition duration-200"
                    >
                      Settled
                    </button>
                  )}

                  

                  {expense.paid_by == userId && (
                    <button
                      class="flex justify-center items-center  w-28 h-12 cursor-pointer rounded-md shadow-2xl text-white font-semibold bg-gradient-to-r from-[#fb7185] via-[#e11d48] to-[#be123c] hover:shadow-xl hover:shadow-red-500 hover:scale-105 duration-300 hover:from-[#be123c] hover:to-[#fb7185]"
                      onClick={() => {
                        deleteExpense(expense.id, "delete");
                      }}
                    >
                      <svg viewBox="0 0 15 15" class="w-5 fill-white">
                        <svg
                          class="w-6 h-6"
                          stroke="currentColor"
                          stroke-width="1.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            stroke-linejoin="round"
                            stroke-linecap="round"
                          ></path>
                        </svg>
                        Button
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : <p className="empty">You have no expenses yet.</p>}
      {DeleterMsg && (<div className="delete-card">{DeleterMsg}</div>)}
      {successMsg && (<div className="success-card">{successMsg}</div>)}
    </div>
  );
};
export default Active;
