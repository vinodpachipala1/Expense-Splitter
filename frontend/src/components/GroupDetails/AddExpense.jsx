import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../path";

const AddExpenses = () => {

    const location = useLocation();
    const [successMsg, setsuccessMsg] = useState("");
    const {groupId, group_name, userId} = location.state || {};
    const [errors, SetErrors] = useState({
        name: "",
        description: "",
        amount: ""
    })

    const [newExpense, SetNewExpense] = useState({
        name: "",
        description: "",
        amount: "",
        groupId: groupId,
        paid_by: userId,

    })

    const handleOnChange = async(e) => {
        const {name, value} = e.target;
        SetNewExpense((prev) => ({
            ...prev, [name] : value
        }));
        SetErrors((prev) => ({
            ...prev, [name] : ""
        }));
    }

    const verify = () => {
        var isTrue = true;
        if(newExpense.name.trim().length < 3){
            isTrue = false;
            SetErrors((prev) => ({...prev, name: "name must be at least 3 character!"}))
        }

        if(newExpense.description.trim().length < 6){
            isTrue = false;
            SetErrors((prev) => ({...prev, description: "name must be at least 6 character!"}))
        }

        if(newExpense.amount.trim().length < 2 || !/^\d+$/.test(newExpense.amount)){
            isTrue = false;
            SetErrors((prev) => ({...prev, amount: "Amount must be atleast 2 digits!"}))
        }

        return isTrue;
    }


    const addnewExpense = async (e) => {
        e.preventDefault();
        if(verify()){
            try {
                const res = await axios.post(`${BASE_URL}/addNewExpense`, {newExpense});
                setsuccessMsg(res.data);
                setTimeout(() => {
                    setsuccessMsg("");
                }, 1500);
            } catch (err) {
              console.log(err.response.data)
              SetErrors((prev) => ({...prev, name: err.response.data}))
            }
        }
    }

    return(<div className="add-expense-card">
  <form onSubmit={addnewExpense} className="expense-form">
    <div className="form-header">
      <h2 className="form-title">Add New Expense</h2>
      <div className="form-icon">💰</div>
    </div>
    
    <div className="form-group">
      <label className="form-label">
        <span className="input-label">Expense Name</span>
        <div className="input-container">
          <input 
            type="text" 
            name="name" 
            placeholder="Dinner, Movie tickets, etc." 
            onChange={handleOnChange}
            className={`form-input ${errors.name ? 'error-input' : ''}`}
          />
          <span className="input-icon">📝</span>
        </div>
      </label>
      {errors.name && <div className="error-message">
        <span className="error-icon">⚠️</span> {errors.name}
      </div>}
    </div>
    
    <div className="form-group">
      <label className="form-label">
        <span className="input-label">Description</span>
        <div className="input-container">
          <textarea 
            name="description" 
            placeholder="Any additional details..." 
            onChange={handleOnChange}
            className={`form-textarea ${errors.description ? 'error-input' : ''}`}
            rows="3"
          ></textarea>
          <span className="textarea-icon">✏️</span>
        </div>
      </label>
      {errors.description && <div className="error-message">
        <span className="error-icon">⚠️</span> {errors.description}
      </div>}
    </div>
    
    <div className="form-group">
      <label className="form-label">
        <span className="input-label">Amount</span>
        <div className="input-container">
          <span className="currency-symbol">₹</span>
          <input 
            type="text" 
            name="amount" 
            placeholder="0.00" 
            onChange={handleOnChange}
            className={`form-input amount-input ${errors.amount ? 'error-input' : ''}`}
          />
          <span className="amount-icon">💲</span>
        </div>
      </label>
      {errors.amount && <div className="error-message">
        <span className="error-icon">⚠️</span> {errors.amount}
      </div>}
    </div>
    
    <button type="submit" className="submit-button">
      <span>Add Expense</span>
      <span className="submit-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
        </svg>
      </span>
    </button>
  </form>
  {successMsg && (<div className="success-card">{successMsg}</div>)}
</div>);
}

export default AddExpenses;