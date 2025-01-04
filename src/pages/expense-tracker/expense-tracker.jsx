import { useState, useEffect } from "react";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetTransaction } from "../../hooks/useGetTransaction";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";  // Import the custom hook
import "./style.css";

export const ExpenseTracker = () => {
    const { addTransaction, deleteTransaction } = useAddTransaction();
    const { transactions } = useGetTransaction();
    const { name, profilePhoto, userID, isAuth } = useGetUserInfo();  

    const [description, setDescription] = useState("");
    const [transactionAmount, setTransactionAmount] = useState(0);
    const [transactionType, setTransactionType] = useState("expense");

    const [totalBalance, setTotalBalance] = useState(0);
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);

    
    useEffect(() => {
        let incomeTotal = 0;
        let expenseTotal = 0;
        transactions.forEach((transaction) => {
            if (transaction.transactionType === "income") {
                incomeTotal += parseFloat(transaction.transactionAmount);
            } else {
                expenseTotal += parseFloat(transaction.transactionAmount);
            }
        });
        setIncome(incomeTotal);
        setExpense(expenseTotal);
        setTotalBalance(incomeTotal - expenseTotal);
    }, [transactions]);

    const onSubmit = (e) => {
        e.preventDefault();
        addTransaction({ description, transactionAmount, transactionType });
        setDescription(""); 
        setTransactionAmount(0); 
    };

   
    if (!isAuth) {
        return <p>Please log in to access the Expense Tracker.</p>;
    }
    const handleDelete = (id) => {
        deleteTransaction(id); 
    };
    return (
        <>
            <div className="expense-tracker">
                <div className="container">
                    <h1>Expense Tracker</h1>
                    <div className="profile">
    <img src={profilePhoto} alt={`${name}'s profile`} className="profile-pic" />
    <h2>Welcome, {name}</h2>
</div>
 
                    <div className="balance">
                        <h3>Your Balance</h3>
                        <h2>${totalBalance.toFixed(2)}</h2>
                    </div>

                    <div className="summary">
                        <div className="income">
                            <h4>Income</h4>
                            <p>${income.toFixed(2)}</p>
                        </div>
                        <div className="expense">
                            <h4>Expense</h4>
                            <p>${expense.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <form className="add-transaction" onSubmit={onSubmit}>
                    <input
                        type="text"
                        placeholder="Description"
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Amount"
                        required
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(parseFloat(e.target.value))}
                    />
                    <div>
                        <input
                            type="radio"
                            id="expense"
                            name="transactionType"
                            value="expense"
                            checked={transactionType === "expense"}
                            onChange={(e) => setTransactionType(e.target.value)}
                        />
                        <label htmlFor="expense" style={{ color: '#000000' }}>Expense</label>

                        <input
                            type="radio"
                            id="income"
                            name="transactionType"
                            value="income"
                            checked={transactionType === "income"}
                            onChange={(e) => setTransactionType(e.target.value)}
                        />
                       <label htmlFor="income" style={{ color: '#000000' }}>Income</label>

                    </div>
                    <button type="submit">Add Transaction</button>
                </form>
            </div>

            <div className="transactions">
                <h3>Transactions</h3>
                <ul>
                    {transactions.map((transaction, index) => (
                        <li key={index}>
                            <h4>{transaction.description}</h4>
                            <p>{transaction.transactionType}</p>
                            <p>${transaction.transactionAmount}</p>
                            <button className="delete-button" onClick={() => handleDelete(transaction.id)}>Delete</button>

                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};
