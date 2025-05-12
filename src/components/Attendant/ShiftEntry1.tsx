'use client';

import { useState } from 'react';

const MOCK_ATTENDANTS = ['Raj', 'Anil', 'Sita', 'Ram', 'Shyam', 'Mohan', 'Ravi', 'Krishna', 'Gopal', 'Laxman'];

export default function ShiftEntryPage() {
  const [attendants, setAttendants] = useState<string[]>([]);
  const [shiftTime, setShiftTime] = useState('morning');
  const [dispenser, setDispenser] = useState(1);
  const [fuelPrices, setFuelPrices] = useState({ HSD: 88.20, MS: 102.34 });

  const nozzleConfig = dispenser === 1 ? 2 : 4;

  const initialReadings = Array.from({ length: nozzleConfig }).map((_, i) => ({
    nozzle: i + 1,
    fuelType: (i + 1) % 2 === 1 ? 'HSD' : 'MS',
    opening: 0,
    closing: 0,
    testQty: 0,
  }));

  const [readings, setReadings] = useState(initialReadings);

  const handleReadingChange = (index: number, field: string, value: number) => {
    const updated = [...readings];
    updated[index] = { ...updated[index], [field]: isNaN(value) ? 0 : value };
    setReadings(updated);
  };

  const handleDispenserChange = (value: number) => {
    setDispenser(value);
    const newCount = value === 1 ? 2 : 4;
    const newReadings = Array.from({ length: newCount }).map((_, i) => ({
      nozzle: i + 1,
      fuelType: (i + 1) % 2 === 1 ? 'HSD' : 'MS',
      opening: 0,
      closing: 0,
      testQty: 0,
    }));
    setReadings(newReadings);
  };

  const isRowComplete = (r: typeof readings[0]) =>
    r.opening !== 0 && r.closing > r.opening;

  const shiftTotal = readings.reduce((acc, r) => {
    const saleQty = r.closing - r.opening - r.testQty;
    const price = r.fuelType === 'HSD' ? fuelPrices.HSD : fuelPrices.MS;
    return acc + saleQty * price;
  }, 0);

  const fuelSummary = readings.reduce(
    (acc, r) => {
      const saleQty = r.closing - r.opening - r.testQty;
      const amount = saleQty * (r.fuelType === 'HSD' ? fuelPrices.HSD : fuelPrices.MS);
      acc[r.fuelType as keyof typeof acc].qty += saleQty;
      acc[r.fuelType as keyof typeof acc].amount += amount;
      return acc;
    },
    { HSD: { qty: 0, amount: 0 }, MS: { qty: 0, amount: 0 } }
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🚦 Shift Entry</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Attendant Selector */}
        <div>
          <label className="font-semibold block mb-1">Attendants</label>
          <div className="flex flex-wrap gap-2">
            {MOCK_ATTENDANTS.map((name) => {
              const isSelected = attendants.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => {
                    if (isSelected) {
                      setAttendants(attendants.filter((a) => a !== name));
                    } else if (attendants.length < 3) {
                      setAttendants([...attendants, name]);
                    }
                  }}
                  className={`px-3 py-1 rounded border ${isSelected
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-800 border-gray-400'
                    }`}
                >
                  {name}
                </button>
              );
            })}
          </div>
          {/* <select
            multiple
            value={attendants}
            onChange={(e) =>
              setAttendants(
                Array.from(e.target.selectedOptions, (opt) => opt.value).slice(0, 3)
              )
            }
            className="w-full border p-2 rounded"
          >
            {MOCK_ATTENDANTS.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <div className="mt-2 flex flex-wrap gap-2">
            {attendants.map((att) => (
              <span
                key={att}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
              >
                {att}
              </span>
            ))}
          </div> */}
        </div>

        {/* Shift Time */}
        <div>
          <label className="font-semibold block mb-1">Shift Time</label>
          <select
            value={shiftTime}
            onChange={(e) => setShiftTime(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="morning">Morning</option>
            <option value="evening">Evening</option>
          </select>
        </div>

        {/* Dispenser Selection */}
        <div>
          <label className="font-semibold block mb-1">Dispenser</label>
          <select
            value={dispenser}
            onChange={(e) => handleDispenserChange(parseInt(e.target.value))}
            className="w-full border p-2 rounded"
          >
            <option value={1}>Dispenser 1</option>
            <option value={2}>Dispenser 2</option>
          </select>
        </div>

        {/* Fuel Price Inputs */}
        <div>
          <h3 className="font-semibold mb-1">Fuel Prices</h3>
          <div className="flex gap-4">
            <div className='flex'>
              <label className="block text-m p-2">🟢 HSD</label>
              <input
                type="number"
                step="0.01"
                value={fuelPrices.HSD}
                onChange={(e) =>
                  setFuelPrices({ ...fuelPrices, HSD: parseFloat(e.target.value) || 0 })
                }
                className="w-24 border text-center p-2 rounded"
              />
            </div>
            <div className='flex'>
              <label className="block text-m p-2">🔵 MS</label>
              <input
                type="number"
                step="0.01"
                value={fuelPrices.MS}
                onChange={(e) =>
                  setFuelPrices({ ...fuelPrices, MS: parseFloat(e.target.value) || 0 })
                }
                className="w-24 border text-center p-2 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nozzle Reading Table */}
      <div>
        <h3 className="font-semibold mb-2">Nozzle Readings</h3>
        <table className="w-full text-sm border-collapse bg-white shadow rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Nozzle</th>
              <th>Fuel</th>
              <th>Opening</th>
              <th>Closing</th>
              <th>Test</th>
              <th>Total</th>
              <th>Sale Qty</th>
              <th>Sale ₹</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r, i) => {
              const totalQty = r.closing - r.opening;
              const saleQty = totalQty - r.testQty;
              const price = r.fuelType === 'HSD' ? fuelPrices.HSD : fuelPrices.MS;
              const amount = saleQty * price;

              return (
                <tr key={i} className="text-center border-t w-24">
                  <td className="p-2">N{i + 1}</td>
                  <td>{r.fuelType}</td>
                  <td>
                    <input
                      type="number"
                      value={r.opening === 0 ? '' : r.opening}
                      placeholder="0"
                      onChange={(e) =>
                        handleReadingChange(i, 'opening', parseFloat(e.target.value) || 0)
                      }
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={r.closing === 0 ? '' : r.closing}
                      placeholder="0"
                      onChange={(e) =>
                        handleReadingChange(i, 'closing', parseFloat(e.target.value) || 0)
                      }
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={r.testQty}
                      step={5}
                      onChange={(e) =>
                        handleReadingChange(i, 'testQty', parseFloat(e.target.value))
                      }
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  {/* <td>{totalQty.toFixed(2)}</td>
                  <td>{saleQty.toFixed(2)}</td>
                  <td>₹{amount.toFixed(2)}</td> */}
                  <td>{isRowComplete(r) ? (r.closing - r.opening).toFixed(2) : '-'}</td>
                  <td>{isRowComplete(r) ? (r.closing - r.opening - r.testQty).toFixed(2) : '-'}</td>
                  <td>
                    {isRowComplete(r)
                      ? `₹${((r.closing - r.opening - r.testQty) * price).toFixed(2)}`
                      : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="space-y-2">
        <div className="flex justify-end gap-10 text-m">
          <div>
            <strong>HSD</strong>: {fuelSummary.HSD.qty.toFixed(2)} L | ₹
            {fuelSummary.HSD.amount.toFixed(2)}
          </div>
          <div>
            <strong>MS</strong>: {fuelSummary.MS.qty.toFixed(2)} L | ₹
            {fuelSummary.MS.amount.toFixed(2)}
          </div>
          <div className="text-right text-lg font-bold">
            🔁 Shift Total: ₹{shiftTotal.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

