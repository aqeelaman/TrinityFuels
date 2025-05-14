'use client';

type ExpenseData = {
  expenseName: string;
  amount: number;
  note?: string;
};

export default function ExpensesPage({
  data,
  setData,
  errors = [],
}: {
  data: ExpenseData[];
  setData: (data: ExpenseData[]) => void;
  errors?: string[];
}) {

  const EXPENSES = ["Auto", "Food", "Jump", "Loading", "Cleaning", "Advance", "Other"];

  const handleChange = (index: number, field: keyof ExpenseData, value: string | number) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: field === 'amount' ? parseFloat(value as string) : value as string };
    setData(updated);
  };

  const isValidEntry = (entry: ExpenseData) => {
    return (
      entry.expenseName.trim() !== "" &&
      entry.amount > 0
    );
  };

  const addExpense = () => {
    // Don't allow add if the last entry is incomplete
    const lastEntry = data[data.length - 1];
    if (!isValidEntry(lastEntry)) {
      alert("Please fill out all fields in the last entry correctly before adding a new one.");
      return;
    }

    setData([...data, { expenseName: '', amount: 0 }]);
  };

  const removeExpense = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  const check = () => {
    console.log('Expenses:', data);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🧾 Expenses</h2>
      {errors.length > 0 && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <h3 className="font-bold">Please fix the following errors:</h3>
          <ul className="list-disc ml-6">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="space-y-6">
        {data.map((expense, index) => (
          <div key={index} className="border p-4 rounded shadow bg-white space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Expense {index + 1}</h3>
              {data.length > 1 && (
                <button
                  onClick={() => removeExpense(index)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Expense Label</label>
                <input
                  list="expense-list"
                  className="input border border-gray-400 bg-gray-100 rounded-md shadow-md pl-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select or type expense"
                  value={expense.expenseName}
                  onChange={(e) => handleChange(index, "expenseName", e.target.value)}
                />
                <datalist id="expense-list">
                  {EXPENSES.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Amount (₹)</label>
                <input
                  type="number"
                  className="input border border-gray-400 bg-gray-100 rounded-md shadow-md pl-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                  value={expense.amount}
                  min={0}
                  onChange={(e) => handleChange(index, 'amount', e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Note</label>
                <input
                  type="text"
                  className="input border border-gray-400 bg-gray-100 rounded-md shadow-md pl-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="(optional)"
                  value={expense.note}
                  onChange={(e) => handleChange(index, 'note', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 mb-4">
        <button
          onClick={addExpense}
          className={`px-4 py-2 rounded transition-colors ${isValidEntry(data[data.length - 1])
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-white cursor-not-allowed"
            }`}
        //disabled={data[data.length - 1].expenseName !=''|| data[data.length - 1].amount <= 0}
        >
          ✚ Add Another Expense
        </button>
      </div>

      <button onClick={check}>click me</button>

    </div>
  );
}

