 import { useState } from "react";

function AddExpense() {
  const [group] = useState(
    JSON.parse(localStorage.getItem("group"))
  );

  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitBetween, setSplitBetween] = useState([]);

  const handleSplitChange = (member) => {
    if (splitBetween.includes(member)) {
      setSplitBetween(
        splitBetween.filter((name) => name !== member)
      );
    } else {
      setSplitBetween([...splitBetween, member]);
    }
  };

  const addExpense = () => {
    if (!expenseName.trim()) {
      alert("Please enter expense name");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter valid amount");
      return;
    }

    if (!paidBy) {
      alert("Please select who paid");
      return;
    }

    if (splitBetween.length === 0) {
      alert("Please select members");
      return;
    }

    // Calculate each person's share
    const perPerson = Number(amount) / splitBetween.length;

    const expense = {
      name: expenseName,
      amount: Number(amount),
      paidBy: paidBy,
      splitBetween: splitBetween,
      perPerson: perPerson,
    };

    // Get existing expenses
    const existingExpenses = JSON.parse(
      localStorage.getItem("expenses")
    ) || [];

    // Add new expense
    existingExpenses.push(expense);

    // Save expenses
    localStorage.setItem(
      "expenses",
      JSON.stringify(existingExpenses)
    );

    console.log(expense);

    alert(
      `Expense added successfully!\nEach person owes ₹${perPerson}`
    );

    // Clear form
    setExpenseName("");
    setAmount("");
    setPaidBy("");
    setSplitBetween([]);
  };

  return (
    <main>
      <section className="add-expense">

        <h1>Add Expense</h1>

        <label>Expense Name</label>

        <input
          type="text"
          placeholder="e.g. Dinner"
          value={expenseName}
          onChange={(e) => setExpenseName(e.target.value)}
          className="text-black bg-white"
          style={{ color: 'black', backgroundColor: 'white'}}
        />

        <label>Amount</label>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-black bg-white"
          style={{ color: 'black', backgroundColor: 'white'}}
        />

        <label>Paid By</label>

        <select
          value={paidBy}
          onChange={(e) => setPaidBy(e.target.value)}
          className="text-black bg-white"
          style={{ color: 'black', backgroundColor:'white'}}
        >
          <option value="">Select member</option>

          {group?.members.map((member, index) => (
            <option key={index} value={member}>
              {member}
            </option>
          ))}
        </select>

        <h2>Split Between</h2>

        {group?.members.map((member, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={splitBetween.includes(member)}
              onChange={() => handleSplitChange(member)}
            />

            {member}
          </label>
        ))}

        <button type="button" onClick={addExpense}>
          Add Expense
        </button>

      </section>
    </main>
  );
}

export default AddExpense;