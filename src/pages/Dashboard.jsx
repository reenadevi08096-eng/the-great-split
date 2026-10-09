 import { useState } from "react";

function Dashboard() {
  const [group] = useState(
    JSON.parse(localStorage.getItem("group"))
  );

  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem("expenses")) || []
  );

  const [settlements, setSettlements] = useState(
    JSON.parse(localStorage.getItem("settlements")) || []
  );

  // =========================
  // CURRENT USER
  // =========================

  const currentUser = group?.currentUser || "";

  // =========================
  // TOTAL EXPENSES
  // =========================

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // =========================
  // CALCULATE BALANCES
  // =========================

  const balances = {};

  if (group) {
    group.members.forEach((member) => {
      balances[member] = 0;
    });
  }

  // Add expenses
  expenses.forEach((expense) => {
    const members = expense.splitBetween;

    if (!members || members.length === 0) {
      return;
    }

    const perPerson =
      expense.amount / members.length;

    // Person who paid gets positive balance
    if (balances[expense.paidBy] !== undefined) {
      balances[expense.paidBy] += expense.amount;
    }

    // Every member gets their share deducted
    members.forEach((member) => {
      if (balances[member] !== undefined) {
        balances[member] -= perPerson;
      }
    });
  });

  // =========================
  // APPLY SETTLEMENTS
  // =========================

  settlements.forEach((settlement) => {
    if (balances[settlement.from] !== undefined) {
      balances[settlement.from] += settlement.amount;
    }

    if (balances[settlement.to] !== undefined) {
      balances[settlement.to] -= settlement.amount;
    }
  });

  // =========================
  // CURRENT USER BALANCE
  // =========================

  const currentUserBalance =
    balances[currentUser] || 0;

  const youAreOwed =
    currentUserBalance > 0
      ? currentUserBalance
      : 0;

  const youOwe =
    currentUserBalance < 0
      ? Math.abs(currentUserBalance)
      : 0;

  // =========================
  // BALANCE LIST
  // =========================

  const balanceList = [];

  if (group && currentUser) {
    group.members.forEach((member) => {

      if (member === currentUser) {
        return;
      }

      const memberBalance =
        balances[member] || 0;

      // Member owes current user
      if (
        memberBalance < 0 &&
        currentUserBalance > 0
      ) {
        const amount = Math.min(
          Math.abs(memberBalance),
          currentUserBalance
        );

        if (amount > 0.01) {
          balanceList.push({
            from: member,
            to: currentUser,
            amount: amount,
          });
        }
      }

      // Current user owes member
      if (
        memberBalance > 0 &&
        currentUserBalance < 0
      ) {
        const amount = Math.min(
          memberBalance,
          Math.abs(currentUserBalance)
        );

        if (amount > 0.01) {
          balanceList.push({
            from: currentUser,
            to: member,
            amount: amount,
          });
        }
      }
    });
  }

  // =========================
  // SETTLE UP
  // =========================

  const handleSettleUp = (balance) => {
    const confirmed = window.confirm(
      `${balance.from} will pay ${balance.to} ₹${balance.amount.toFixed(
        2
      )}.\n\nMark this payment as settled?`
    );

    if (!confirmed) {
      return;
    }

    const newSettlement = {
      from: balance.from,
      to: balance.to,
      amount: balance.amount,
      date: new Date().toISOString(),
    };

    const updatedSettlements = [
      ...settlements,
      newSettlement,
    ];

    localStorage.setItem(
      "settlements",
      JSON.stringify(updatedSettlements)
    );

    setSettlements(updatedSettlements);

    alert("Payment settled successfully! 🎉");
  };

  // =========================
  // DELETE EXPENSE
  // =========================

  const handleDeleteExpense = (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    const updatedExpenses = expenses.filter(
      (_, expenseIndex) =>
        expenseIndex !== index
    );

    localStorage.setItem(
      "expenses",
      JSON.stringify(updatedExpenses)
    );

    setExpenses(updatedExpenses);

    alert("Expense deleted successfully! 🗑️");
  };

  return (
    <main>

      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <section className="summary-cards">

        <div className="summary-card">
          <h1>Total Expenses</h1>
          <p>
            ₹{totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="summary-card">
          <h1>You Owe</h1>
          <p>
            ₹{youOwe.toFixed(2)}
          </p>
        </div>

        <div className="summary-card">
          <h1>You Are Owed</h1>
          <p>
            ₹{youAreOwed.toFixed(2)}
          </p>
        </div>

        <div className="summary-card">
          <h1>Total Groups</h1>
          <p>
            {group ? 1 : 0}
          </p>
        </div>

      </section>


      {/* =========================
          GROUP
      ========================= */}

      <section className="groups">

        <h2>Your Groups</h2>

        {group ? (
          <div className="group-card">

            <h3>{group.name}</h3>

            <p>
              You: {currentUser}
            </p>

            <p>
              Members: {group.members.length}
            </p>

            <ul>
              {group.members.map(
                (member, index) => (
                  <li key={index}>
                    {member}
                  </li>
                )
              )}
            </ul>

            <button
            type="button"
              onClick={() => {
                window.location.href =
                  "add-expense";
              }}
            >
              Add Expense
            </button>

          </div>
        ) : (
          <p>
            No groups created yet.
          </p>
        )}

      </section>


      {/* =========================
          BALANCES
      ========================= */}

      <section className="balances">

        <h2>Balances</h2>

        {balanceList.length === 0 ? (
          <p>
            Everyone is settled up 🎉
          </p>
        ) : (
          <div>

            {balanceList.map(
              (balance, index) => (
                <div
                  className="balance-card"
                  key={index}
                >

                  <p>
                    <strong>
                      {balance.from}
                    </strong>{" "}
                    owes{" "}
                    <strong>
                      {balance.to}
                    </strong>
                  </p>

                  <h3>
                    ₹{balance.amount.toFixed(2)}
                  </h3>

                  <button
                    onClick={() =>
                      handleSettleUp(balance)
                    }
                  >
                    Settle Up
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </section>


      {/* =========================
          RECENT EXPENSES
      ========================= */}

      <section className="recent-expenses">

        <h2>Recent Expenses</h2>

        {expenses.length === 0 ? (
          <p>
            No expenses added yet.
          </p>
        ) : (
          <div>

            {expenses.map(
              (expense, index) => (
                <div
                  className="expense-card"
                  key={index}
                >

                  <h3>
                    {expense.name}
                  </h3>

                  <p>
                    Amount: ₹
                    {expense.amount.toFixed(2)}
                  </p>

                  <p>
                    Paid By:{" "}
                    {expense.paidBy}
                  </p>

                  <p>
                    Split Between:{" "}
                    {expense.splitBetween.join(
                      ", "
                    )}
                  </p>

                  <p>
                    Each Person: ₹
                    {expense.perPerson.toFixed(
                      2
                    )}
                  </p>

                  <button
                    onClick={() =>
                      handleDeleteExpense(index)
                    }
                  >
                    Delete Expense
                  </button>

                </div>
              )
            )}

          </div>
        )}

      </section>


      {/* =========================
          SETTLEMENT HISTORY
      ========================= */}

      <section className="settlements">

        <h2>Settlement History</h2>

        {settlements.length === 0 ? (
          <p>
            No settlements yet.
          </p>
        ) : (
          <div>

            {settlements.map(
              (settlement, index) => (
                <div
                  className="settlement-card"
                  key={index}
                >

                  <p>
                    <strong>
                      {settlement.from}
                    </strong>{" "}
                    paid{" "}
                    <strong>
                      {settlement.to}
                    </strong>
                  </p>

                  <h3>
                    ₹
                    {settlement.amount.toFixed(
                      2
                    )}
                  </h3>

                </div>
              )
            )}

          </div>
        )}

      </section>

    </main>
  );
}

export default Dashboard;