'use client'
import { Dispatch, SetStateAction } from 'react';

type PaymentEntries = {
  denominations: {
    500: number;
    200: number;
    100: number;
    50: number;
    20: number;
    10: number;
  };
  coins: number;
  paytm: number;
  swipe: number;
  scheme: number;
};

export default function CashEntryPage({
  data,
  setData,
  errors = [],
}: {
  data: PaymentEntries;
  setData: Dispatch<SetStateAction<PaymentEntries>>;
  errors?: string[];
}) {
  const handleDenominationChange = (key: number, value: number) => {
    const updatedData = { ...data };
    updatedData.denominations[key as keyof typeof data.denominations] = value;
    setData(updatedData);
  };

  const handleChange = (category: keyof Omit<PaymentEntries, 'denominations'>, value: number) => {
    const updatedData = { ...data };
    updatedData[category] = value;
    setData(updatedData);
  };

  const denominationOrder = [500, 200, 100, 50, 20, 10]; 

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-left">💰 Payment Entry</h2>
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
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-semibold mb-2">Denominations</h3>
            <div className="grid grid-cols-3 gap-4 font-semibold text-sm text-gray-500 mb-2">
              <span>Denomination</span>
              <span>Count</span>
              <span>Total</span>
            </div>
            {denominationOrder.map((denom) => {
              const count = data.denominations[denom as keyof typeof data.denominations] || 0;
              const total = denom * count;
            

              return (
                <div key={denom} className="grid grid-cols-3 items-center gap-4 mb-2">
                  <label className="text-base font-medium">{`₹${denom}`}</label>
                  <input
                    type="number"
                    className="input border px-3 py-1 rounded"
                    value={count}
                    min={0}
                    onChange={(e) =>
                      handleDenominationChange(denom, parseInt(e.target.value) || 0)
                    }
                    placeholder="Count"
                  />
                  <span className="font-semibold text-green-700">₹{total}</span>
                </div>
              );
            })}
          </div>

          {/* Payments */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-2">Payments</h3>

            <div className="flex items-center gap-4">
              <label className="w-20 font-medium">Coins</label>
              <input
                type="number"
                className="input border px-3 py-1 rounded w-full"
                value={data.coins}
                min={0}
                onChange={(e) => handleChange('coins', parseInt(e.target.value) || 0)}
                placeholder="₹10 coins total"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-20 font-medium">Paytm</label>
              <input
                type="number"
                className="input border px-3 py-1 rounded w-full"
                value={data.paytm}
                min={0}
                onChange={(e) => handleChange('paytm', parseFloat(e.target.value) || 0)}
                placeholder="₹0"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-20 font-medium">Swipe</label>
              <input
                type="number"
                className="input border px-3 py-1 rounded w-full"
                value={data.swipe}
                min={0}
                onChange={(e) => handleChange('swipe', parseFloat(e.target.value) || 0)}
                placeholder="₹0"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="w-20 font-medium">Scheme</label>
              <input
                type="number"
                className="input border px-3 py-1 rounded w-full"
                value={data.scheme}
                min={0}
                onChange={(e) => handleChange('scheme', parseFloat(e.target.value) || 0)}
                placeholder="₹0"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
