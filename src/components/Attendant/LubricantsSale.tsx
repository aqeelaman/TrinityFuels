'use client';

import { useState } from 'react';

const LUBRICANTS = [
  { name: 'Engine Oil 1L', price: 320 },
  { name: 'Gear Oil 500ml', price: 180 },
  { name: 'Coolant 1L', price: 210 },
];

export default function LubricantsPage({
  data,
  setData,
  errors = []
}: {
  data: { name: string; quantity: number; price: number }[];
  setData: (data: { name: string; quantity: number; price: number }[]) => void;
  errors?: string[];
}) {
  const quantities = data.map((item) => item.quantity || 0);

  const handleQtyChange = (index: number, value: number) => {
    const updated = [...data];
    updated[index].quantity = value;
    setData(updated);
  };

  const totalAmount = data.reduce(
    (sum, item, i) => sum + item.price * item.quantity,
    0
  );

  const check = () => {
    console.log('Lubricants:', data);
    console.log('Quantities:', quantities);
    console.log('Total Amount:', totalAmount);
    console.log('Data:', data);
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">🛢️ Lubricants</h2>

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

      <table className="w-full border-collapse bg-white shadow rounded overflow-hidden text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 text-left">Lubricant</th>
            <th>Unit Price (₹)</th>
            <th>Quantity</th>
            <th>Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((lube, i) => (
            <tr key={lube.name} className="border-t text-center">
              <td className="p-2 text-left">{lube.name}</td>
              <td>{lube.price}</td>
              <td>
                <input
                  type="number"
                  value={lube.quantity || ''}
                  min={0}
                  placeholder="0"
                  onChange={(e) =>
                    handleQtyChange(i, parseFloat(e.target.value) || 0)
                  }
                  className="w-20 p-1 border rounded text-right"
                />
              </td>
              <td>{(lube.quantity * lube.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right text-lg font-bold">
        Total Lubricant Sales: ₹{totalAmount.toFixed(2)}
      </div>
      <button onClick={() => check()}>click me</button>
    </div>
  );
}
