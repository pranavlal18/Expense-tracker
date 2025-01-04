import './style.css';
import { useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, LabelList, Label } from 'recharts';
import { jsPDF } from 'jspdf';

export const Analytics = ({ income, expense }) => {
    const [incomeGoal, setIncomeGoal] = useState(6000); // Default income goal
    const [expenseGoal, setExpenseGoal] = useState(2000); // Default expense goal
    const [editing, setEditing] = useState(false); // To toggle editing mode

    const total = income + expense;
    const data = [
        { name: 'Income', value: income },
        { name: 'Expense', value: expense },
    ];
    const COLORS = ['#00C49F', '#dd1b1b']; // Green for income, red for expense

    // Calculate progress
    const incomeProgress = Math.min((income / incomeGoal) * 100, 100); // Cap at 100%
    const expenseProgress = Math.min((expense / expenseGoal) * 100, 100); // Cap at 100%

    const handleSaveGoals = (e) => {
        e.preventDefault();
        const newIncomeGoal = parseFloat(e.target.incomeGoal.value);
        const newExpenseGoal = parseFloat(e.target.expenseGoal.value);

        if (!isNaN(newIncomeGoal) && newIncomeGoal > 0) {
            setIncomeGoal(newIncomeGoal);
        }

        if (!isNaN(newExpenseGoal) && newExpenseGoal > 0) {
            setExpenseGoal(newExpenseGoal);
        }

        setEditing(false); // Exit editing mode
    };

    const generateReport = () => {
        const doc = new jsPDF();
        doc.text(`Expense Report - ${new Date().toLocaleDateString()}`, 10, 10);
        doc.text(`Total Income: $${income.toFixed(2)}`, 10, 20);
        doc.text(`Income Goal: $${incomeGoal.toFixed(2)}`, 10, 30);
        doc.text(`Total Expense: $${expense.toFixed(2)}`, 10, 40);
        doc.text(`Expense Goal: $${expenseGoal.toFixed(2)}`, 10, 50);
        doc.text(`Net Balance: $${(income - expense).toFixed(2)}`, 10, 60);
        doc.save("expense_report.pdf");
    };

    return (
        <div className="analytics-container">
            <h2 className="analytics-title">Spending Breakdown</h2>

            {/* Pie Chart */}
            <PieChart width={600} height={600}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={200}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    {/* Label in the center for total */}
                    <Label
                        value={`Total: $${total.toFixed(2)}`}
                        position="center"
                        style={{ fontSize: '16px', fontWeight: 'bold', fill: '#333' }}
                    />
                    <LabelList
                        dataKey="value"
                        position="outside"
                        formatter={(value) => `${((value / total) * 100).toFixed(1)}%`}
                        style={{ fontSize: '12px', fill: '#555' }}
                    />
                </Pie>
                <Tooltip
                    contentStyle={{
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        border: '1px solid #ccc',
                    }}
                    itemStyle={{
                        color: '#333',
                        fontSize: '14px',
                    }}
                />
            </PieChart>

            {/* Budget Goals */}
            <div className="budget-goals">
                <h3>Budget Goals</h3>
                {!editing ? (
                    <>
                        {/* Display Goals */}
                        <div className="goal">
                            <p>Income Goal: ${incomeGoal.toFixed(2)}</p>
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{
                                        width: `${incomeProgress}%`,
                                        backgroundColor: incomeProgress === 100 ? '#28a745' : '#00C49F',
                                    }}
                                ></div>
                            </div>
                            <p>{incomeProgress.toFixed(1)}% achieved</p>
                        </div>

                        <div className="goal">
                            <p>Expense Goal: ${expenseGoal.toFixed(2)}</p>
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{
                                        width: `${expenseProgress}%`,
                                        backgroundColor: expenseProgress === 100 ? '#dc3545' : '#dd1b1b',
                                    }}
                                ></div>
                            </div>
                            <p>{expenseProgress.toFixed(1)}% spent</p>
                        </div>

                        {/* Button to Edit Goals */}
                        <button className="edit-goals-btn" onClick={() => setEditing(true)}>
                            Set Goals
                        </button>
                    </>
                ) : (
                    <form className="set-goals-form" onSubmit={handleSaveGoals}>
                        <div className="form-group">
                            <label htmlFor="incomeGoal">Income Goal: </label>
                            <input
                                type="number"
                                id="incomeGoal"
                                name="incomeGoal"
                                defaultValue={incomeGoal}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="expenseGoal">Expense Goal: </label>
                            <input
                                type="number"
                                id="expenseGoal"
                                name="expenseGoal"
                                defaultValue={expenseGoal}
                                required
                            />
                        </div>
                        <button type="submit" className="save-goals-btn">
                            Save Goals
                        </button>
                    </form>
                )}
            </div>

            {/* Generate Report Button */}
            <button className="generate-report-btn" onClick={generateReport}>
                Generate Report
            </button>
        </div>
    );
};