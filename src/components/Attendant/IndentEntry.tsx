'use client'

type IndentSaleEntry = {
  customerName: string;
  vehicleNumber: string;
  fuelType: "HSD" | "MS";
  quantity: number;
  slipNumber: number;
  time: string;
};

export default function IndentEntry({ data, setData, }: {
  data: IndentSaleEntry[]; setData: (data: IndentSaleEntry[]) => void;
}) {

  const CUSTOMERS = ["TATA Sales", "TATA Service", "Hysum Steels", "BMW", "Kalpavriksha","TK","VK","Anil Noronha","LPG"];

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    setData(updated);
  };

  const isValidEntry = (entry: IndentSaleEntry) => {
    const timeHour = parseInt(entry.time.split(":")[0], 10);
    return (
      entry.customerName.trim() !== "" &&
      entry.vehicleNumber.trim() !== "" && // or optional?
      entry.fuelType &&
      entry.quantity > 0 &&
      entry.slipNumber >= 100 && entry.slipNumber <= 999 &&
      !isNaN(timeHour) && timeHour >= 6 && timeHour <= 23
    );
  };

  const addEntry = () => {
    const lastEntry = data[data.length - 1];
    if (!isValidEntry(lastEntry)) {
      alert("Please fill out all fields in the last entry correctly before adding a new one.");
      return;
    }

    setData([
      ...data,
      {
        customerName: "",
        vehicleNumber: "",
        fuelType: "MS",
        quantity: 0,
        slipNumber: 0,
        time: "",
      },
    ]);
  };

  const removeEntry = (index: number) => {
    const updated = [...data];
    updated.splice(index, 1);
    setData(updated);
  };

  const check = () => {
    console.log("Indent Sales Data:", data);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📋 Indent Sales</h2>
      <div className="space-y-6">
        {data.map((entry, index) => (
          <div key={index} className="border p-4 rounded shadow bg-white space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Entry {index + 1}</h3>
              {data.length > 1 && (
                <button
                  onClick={() => removeEntry(index)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Customer Name</label>
                <input
                  list="customer-list"
                  className="input border border-gray-400 bg-gray-100 rounded-md shadow-md pl-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Select or type customer"
                  value={entry.customerName}
                  onChange={(e) => handleChange(index, "customerName", e.target.value)}
                />
                <datalist id="customer-list">
                  {CUSTOMERS.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Slip Number (100-999)</label>
                <input
                  type="number"
                  className="input border border-gray-400 bg-gray-100 rounded-md shadow-md pl-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter slip number"
                  value={entry.slipNumber}
                  min={0}
                  onChange={(e) => handleChange(index, "slipNumber", parseInt(e.target.value))}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Vehicle Number</label>
                <input
                  type="text"
                  className="input border border-gray-400 bg-gray-100 rounded-md shadow-md pl-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter vehicle number"
                  value={entry.vehicleNumber}
                  onChange={(e) => handleChange(index, "vehicleNumber", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Time of Fuelling (6AM - 11PM)</label>
                <input
                  type="time"
                  className="input border border-gray-400 bg-gray-100 rounded-md shadow-md pl-4 pr-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter time of fuelling"
                  value={entry.time}
                  onChange={(e) => handleChange(index, "time", e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Fuel Type</label>
                <select
                  className="input border border-gray-400 bg-gray-100 rounded-md shadow-md pl-4 pr-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={entry.fuelType}
                  onChange={(e) => handleChange(index, "fuelType", e.target.value)}
                >
                  <option>MS</option>
                  <option>HSD</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Quantity (Litres)</label>
                <input
                  type="number"
                  className="input border border-gray-400 bg-gray-100 rounded-md shadow-md pl-4 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter quantity in litres"
                  value={entry.quantity}
                  min={0}
                  onChange={(e) => handleChange(index, "quantity", parseFloat(e.target.value))}
                />
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 mb-6">
        <button
          onClick={addEntry}
          //disabled={!isValidEntry(data[data.length - 1])}
          className={`px-4 py-2 rounded transition-colors ${isValidEntry(data[data.length - 1])
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-400 text-white cursor-not-allowed"
            }`}
        >
          ✚ Add Another Entry
        </button>
      </div>
      <button onClick={() => check()}>click me</button>
    </div>
  );
}

