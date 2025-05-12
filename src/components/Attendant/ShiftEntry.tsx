'use client';

import { Dispatch, SetStateAction, useEffect } from 'react';

const MOCK_ATTENDANTS = ['Yathish', 'Sujan', 'James', 'John', 'Mallika', 'Likith', 'Ravi', 'Rahul', 'Gopal', 'Sharma'];

type FuelType = 'HSD' | 'MS';

type Reading = {
  nozzle: number;
  fuelType: FuelType;
  opening: number;
  closing: number;
  testQty: number;
};

type ShiftData = {
  attendants: string[];
  shiftTime: string;
  date: string;
  dispenser: number;
  fuelPrices: {
    HSD: number;
    MS: number;
  };
  readings: Reading[];
};

export default function ShiftEntryPage({ data, setData }: { data: ShiftData; setData: Dispatch<SetStateAction<ShiftData>> }) {
  const { attendants, shiftTime, date, dispenser, fuelPrices, readings } = data;

  // useEffect(() => {
  //   // Initialize readings for dispenser 1 on load
  //   const nozzleCount = dispenser === 1 ? 2 : 4;
  //   const initialReadings = Array.from({ length: nozzleCount }).map((_, i) => ({
  //     nozzle: i + 1,
  //     fuelType: (i + 1) % 2 === 1 ? 'HSD' as FuelType : 'MS' as FuelType,
  //     opening: 0,
  //     closing: 0,
  //     testQty: 0,
  //   }));
  //   setData((prev) => ({ ...prev, readings: initialReadings }));
  // }, [setData]);

  const handleReadingChange = (index: number, field: keyof Reading, value: number) => {
    const updated = [...readings];
    updated[index] = { ...updated[index], [field]: isNaN(value) ? 0 : value };
    setData((prev) => ({ ...prev, readings: updated }));
  };

  const handleDispenserChange = (value: number) => {
    const nozzleCount = value === 1 ? 2 : 4;
    const newReadings = Array.from({ length: nozzleCount }).map((_, i) => ({
      nozzle: i + 1,
      fuelType: (i + 1) % 2 === 1 ? 'HSD' as FuelType : 'MS' as FuelType,
      opening: 0,
      closing: 0,
      testQty: 0,
    }));
    setData((prev) => ({ ...prev, dispenser: value, readings: newReadings }));
  };

  const isRowComplete = (r: Reading) => r.opening !== 0 && r.closing > r.opening;

  const shiftTotal = readings.reduce((acc, r) => {
    const saleQty = r.closing - r.opening - r.testQty;
    const price = r.fuelType === 'HSD' ? fuelPrices.HSD : fuelPrices.MS;
    return acc + saleQty * price;
  }, 0);

  const fuelSummary = readings.reduce(
    (acc, r) => {
      const saleQty = r.closing - r.opening - r.testQty;
      const amount = saleQty * (r.fuelType === 'HSD' ? fuelPrices.HSD : fuelPrices.MS);
      acc[r.fuelType].qty += saleQty;
      acc[r.fuelType].amount += amount;
      return acc;
    },
    { HSD: { qty: 0, amount: 0 }, MS: { qty: 0, amount: 0 } }
  );

  const check = () => {
    console.log('Attendants:', attendants);
    console.log('Shift Time:', shiftTime);
    console.log('Dispenser:', dispenser);
    console.log('Fuel Prices:', fuelPrices);
    console.log('Readings:', readings);
    console.log('Shift Total:', shiftTotal);
    console.log('Fuel Summary:', fuelSummary);
    console.log('Data:', data);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🚦 Shift Entry</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Attendants */}
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
                      setData((prev) => ({
                        ...prev,
                        attendants: prev.attendants.filter((a) => a !== name),
                      }));
                    } else if (attendants.length < 3) {
                      setData((prev) => ({
                        ...prev,
                        attendants: [...prev.attendants, name],
                      }));
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
        </div>

        <div className="flex gap-4">
          {/* Shift Date */}
          <div className="w-1/2">
            <label className="font-semibold block mb-1">Shift Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) =>
                setData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full border p-2 rounded"
            />
          </div>
          {/* Shift Time */}
          <div className="w-1/2">
            <label className="font-semibold block mb-1">Shift Time</label>
            <select
              value={shiftTime}
              onChange={(e) =>
                setData((prev) => ({ ...prev, shiftTime: e.target.value }))
              }
              className="w-full border p-2 rounded"
            >
              <option value="morning">Morning</option>
              <option value="evening">Evening</option>
            </select>
          </div>
        </div>


        {/* Dispenser */}
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

        {/* Fuel Prices */}
        <div>
          <h3 className="font-semibold mb-1">Fuel Prices</h3>
          <div className="flex gap-4">
            <div className="flex">
              <label className="block text-m p-2">🟢 HSD</label>
              <input
                type="number"
                step="0.01"
                value={fuelPrices.HSD}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    fuelPrices: { ...prev.fuelPrices, HSD: parseFloat(e.target.value) || 0 },
                  }))
                }
                className="w-24 border text-center p-2 rounded"
              />
            </div>
            <div className="flex">
              <label className="block text-m p-2">🔵 MS</label>
              <input
                type="number"
                step="0.01"
                value={fuelPrices.MS}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    fuelPrices: { ...prev.fuelPrices, MS: parseFloat(e.target.value) || 0 },
                  }))
                }
                className="w-24 border text-center p-2 rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Readings Table */}
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
                      onChange={(e) => handleReadingChange(i, 'opening', parseFloat(e.target.value))}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={r.closing === 0 ? '' : r.closing}
                      placeholder="0"
                      onChange={(e) => handleReadingChange(i, 'closing', parseFloat(e.target.value))}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={r.testQty}
                      step={5}
                      onChange={(e) => handleReadingChange(i, 'testQty', parseFloat(e.target.value))}
                      className="w-20 p-1 border rounded"
                    />
                  </td>
                  <td>{isRowComplete(r) ? totalQty.toFixed(2) : '-'}</td>
                  <td>{isRowComplete(r) ? saleQty.toFixed(2) : '-'}</td>
                  <td>{isRowComplete(r) ? `₹${amount.toFixed(2)}` : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
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
      <button onClick={() => check()}>click me</button>
    </div>
  );
}

