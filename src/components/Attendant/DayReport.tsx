'use client';

import { ReportData } from '@/types/types';
import { utils, writeFile } from 'xlsx';

type Props = {
  report: ReportData;
};

export default function ReportPage({ report }: Props) {
  const { shift, receipt, indent, lubricants, expenses } = report;

  // Utility function to calculate totals for fuel types
  const calculateFuelSummary = () => {
    const summary = shift.readings.reduce(
      (acc, r) => {
        const saleQty = r.closing - r.opening - r.testQty;
        const price = shift.fuelPrices[r.fuelType];
        const amount = saleQty * price;

        if (!acc[r.fuelType]) {
          acc[r.fuelType] = { qty: 0, price, amount: 0 };
        }

        acc[r.fuelType].qty += saleQty;
        acc[r.fuelType].amount += amount;
        return acc;
      },
      {} as Record<string, { qty: number; price: number; amount: number }>
    );

    return Object.entries(summary).map(([fuelType, { qty, price, amount }]) => [
      fuelType,
      qty.toFixed(2),
      price.toFixed(2),
      amount.toFixed(2),
    ]);
  };

  // Utility function to calculate total rows for any dataset
  const calculateTotal = (rows: { Amount: number }[]) =>
    rows.reduce((sum, row) => sum + row.Amount, 0);

  // Generate rows for different sections
  const nozzleRows = shift.readings.map((r) => ({
    Nozzle: r.nozzle,
    FuelType: r.fuelType,
    Opening: r.opening,
    Closing: r.closing,
    TestQty: r.testQty,
    SaleQty: r.closing - r.opening - r.testQty,
    Price: shift.fuelPrices[r.fuelType],
    Amount: (r.closing - r.opening - r.testQty) * shift.fuelPrices[r.fuelType],
  }));

  const indentRows = indent.map((s) => ({
    Customer: s.customerName,
    Vehicle: s.vehicleNumber || '—',
    FuelType: s.fuelType,
    Qty: s.quantity,
    Price: shift.fuelPrices[s.fuelType],
    Amount: s.quantity * shift.fuelPrices[s.fuelType],
    IndentSlip: s.slipNumber,
    Time: s.time,
  }));

  const lubricantRows = lubricants.map((l) => ({
    Name: l.name,
    Qty: l.quantity,
    Price: l.price,
    Amount: l.quantity * l.price,
  }));

  const expenseRows = expenses.map((e) => ({
    Category: e.expenseName,
    Amount: e.amount,
    Note: e.note || '',
  }));

  const denominationRows = Object.entries(receipt.denominations)
    .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
    .map(([denom, count]) => ({
      Denomination: `₹${denom}`,
      Count: count,
      Amount: parseInt(denom) * count,
    }));

  // Totals
  const totalFuelSales = calculateTotal(nozzleRows);
  const totalIndent = calculateTotal(indentRows);
  const totalLubricants = calculateTotal(lubricantRows);
  const totalExpenses = calculateTotal(expenseRows);
  const cashTotal = denominationRows.reduce((sum, row) => sum + row.Amount, 0) + receipt.coins;
  const paymentTotal = receipt.paytm + receipt.swipe + (receipt.scheme || 0);
  const totalReceipt = cashTotal + paymentTotal;
  const excessOrShort = totalFuelSales + totalLubricants - totalReceipt - totalIndent - totalExpenses;

  // Fuel summary rows
  const fuelSummaryRows = calculateFuelSummary();

  // SectionTable Component
  const SectionTable = ({ title, headers, rows, }: { title: string; headers: string[]; rows: (string | number)[][]; }) => (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <div className="overflow-x-auto rounded-lg border shadow-md">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-200">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="border px-4 py-2 text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                {row.map((cell, j) => (
                  <td key={j} className="border px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  // 🟢 Export to Excel
  const exportToExcel = () => {
    const wb = utils.book_new();

    const summary = [
      ['TRINITY FUELS KANNUR'],
      ['Date', shift.date],
      ['Shift Time', shift.shiftTime],
      ['Dispenser', shift.dispenser],
      ['Attendants', shift.attendants.join(', ')],
      ['Fuel Prices', `HSD ₹${shift.fuelPrices.HSD}, MS ₹${shift.fuelPrices.MS}`],
    ];

    const fuelTable = [
      [],
      ['Fuel Sales'],
      ['Nozzle', 'FuelType', 'Opening', 'Closing', 'TestQty', 'SaleQty', 'Price', 'Amount'],
      ...nozzleRows.map((r) => Object.values(r)),
      ['Total', '', '', '', '', '', '', totalFuelSales],
    ];

    const fuelSummaryTable = [
      [],
      ['Fuel Summary'],
      ['FuelType', 'TotalQty', 'Rate', 'TotalAmount'],
      ...fuelSummaryRows.map((r) => Object.values(r)),
      ['Total', '', '', totalFuelSales],
    ];

    const indentTable = [
      [],
      ['Indent Sales'],
      ['Customer', 'Vehicle', 'FuelType', 'Qty', 'Price', 'Amount', 'IndentSlip', 'Time'],
      ...indentRows.map((r) => Object.values(r)),
      ['Total', '', '', '', '', totalIndent],
    ];

    const lubTable = [
      [],
      ['Lubricants'],
      ['Name', 'Qty', 'Price', 'Amount'],
      ...lubricantRows.map((r) => Object.values(r)),
      ['Total', '', '', totalLubricants],
    ];

    const cashTable = [
      [],
      ['Cash Summary'],
      ['Denomination', 'Count', 'Amount'],
      ...denominationRows.map((r) => Object.values(r)),
      ['Coins', '', receipt.coins],
      ['Cash Total', '', cashTotal],
      ['Paytm', '', receipt.paytm],
      ['Swipe', '', receipt.swipe],
      ['Scheme', '', receipt.scheme || 0],
      ['Total', '', totalReceipt],
    ];

    const expTable = [
      [],
      ['Expenses'],
      ['Category', 'Amount', 'Note'],
      ...expenseRows.map((r) => Object.values(r)),
      ['Total', totalExpenses],
    ];

    const grandTotal = [
      [],
      ['Grand Total Summary'],
      ['Total Fuel Sales', totalFuelSales],
      ['Total Indent Sales', totalIndent],
      ['Total Lubricants', totalLubricants],
      ['Total Expenses', totalExpenses],
      ['Total Cash Collected', totalReceipt],
      ['Excess/Shortage', excessOrShort],
    ];

    const data = [
      ...summary,
      ...fuelTable,
      ...fuelSummaryTable,
      ...indentTable,
      ...lubTable,
      ...cashTable,
      ...expTable,
      ...grandTotal,
    ];

    // Format the date as dd-mm-yy
    const shiftDate = new Date(shift.date);
    const formattedDate = `${shiftDate.getDate().toString().padStart(2, '0')}-${(shiftDate.getMonth() + 1).toString().padStart(2, '0')}-${shiftDate.getFullYear().toString().slice(-2)}`;

    // Combine the formatted date, shift time, and "Report"
    const fileName = `${formattedDate}_${shift.shiftTime}_Report.xlsx`;


    const sheet = utils.aoa_to_sheet(data);
    utils.book_append_sheet(wb, sheet, 'Shift Report');
    writeFile(wb, fileName);
  };

  return (

    <div className="px-6 py-5 space-y-4  bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">🧾 Shift Report</h2>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Download Report
        </button>
      </div>
      <div className='max-w-4xl mx-auto px-6 py-3 space-y-4'>
        <section className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
          <h3 className="text-xl font-semibold">Shift Info</h3>
          <p><strong>Date:</strong> {shift.date}<strong> ~ Shift:</strong> {shift.shiftTime === 'morning' ? 'Morning (6am to 5pm)' : 'Evening (5pm to 11pm)'}</p>
          <p><strong>Dispenser:</strong> {shift.dispenser}</p>
          <p><strong>Attendants:</strong> {shift.attendants.join(', ')}</p>
          <p><strong>Fuel Prices:</strong> HSD ₹{shift.fuelPrices.HSD}, MS ₹{shift.fuelPrices.MS}</p>
        </section>

        <SectionTable
          title="Fuel Sales"
          headers={['Nozzle', 'Fuel Type', 'Opening', 'Closing', 'Qty', 'Test Qty', 'Sale Qty', 'Price', 'Amount']}
          rows={shift.readings.map(r => {
            const qty = r.closing - r.opening;
            const saleQty = qty - r.testQty;
            const amt = qty * shift.fuelPrices[r.fuelType];
            return ["N" + r.nozzle, r.fuelType, r.opening, r.closing, qty.toFixed(2), r.testQty, saleQty, shift.fuelPrices[r.fuelType], amt.toFixed(2)];
          })}
        />

        <SectionTable
          title="Fuel Summary"
          headers={['Fuel Type', 'Total Qty', 'Rate', 'Total Amount']}
          rows={fuelSummaryRows}
        />

        {indent.length > 0 && indent.some(i => i.customerName.trim() !== '' && i.quantity > 0) ? (
          <SectionTable
            title="Indent Sales"
            headers={['S.No.', 'Customer', 'Vehicle', 'Fuel', 'Qty', 'Amount', 'Slip #', 'Time']}
            rows={indent.map((i, idx) => [
              idx + 1,
              i.customerName,
              i.vehicleNumber || '',
              i.fuelType,
              i.quantity,
              (i.quantity * shift.fuelPrices[i.fuelType]).toFixed(2),
              i.slipNumber,
              i.time,
            ])}
          />
        ) : (
          <section className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Indent Sales</h3>
            <p className="text-gray-600 italic">No Indent Credits</p>
          </section>
        )}


        {lubricants.some((l) => l.quantity > 0) ? (
          <SectionTable
            title="Lubricant Sales"
            headers={['S.No.', 'Name', 'Qty', 'Price', 'Amount']}
            rows={lubricants
              .filter((l) => l.quantity > 0)
              .map((l, idx) => [
                idx + 1,
                l.name,
                l.quantity,
                l.price,
                (l.quantity * l.price).toFixed(2),
              ])
            }
          />
        ) : (
          <section className="bg-gray-100 p-4 rounded-lg shadow-md space-y-4">
            <h3 className="text-xl font-semibold">Lubricant Sales</h3>
            <p className="text-gray-600 italic">No Lubricants Sold</p>
          </section>
        )}

        {expenses.some(e => e.expenseName.trim() !== '' && e.amount > 0) ? (
          <SectionTable
            title="Expenses"
            headers={['S.No.', 'Category', 'Amount', 'Note']}
            rows={expenses
              .filter(e => e.expenseName.trim() !== '' && e.amount > 0)
              .map((e, idx) => [
                idx + 1,
                e.expenseName,
                e.amount,
                e.note || '',
              ])}
          />
        ) : (
          <section className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Expenses</h3>
            <p className="text-gray-600 italic">No Expenses</p>
          </section>
        )}


        <SectionTable
          title="Payments"
          headers={['Denomination', 'Count', 'Total']}
          rows={[...denominationRows.map((r) => Object.values(r)), ['Coins', '', receipt.coins], ['Cash Total', '', cashTotal], ['Paytm', '', receipt.paytm], ['Swipe', '', receipt.swipe], ['Scheme', '', receipt.scheme ?? 0]]}
        />

        <section className="bg-gray-100 p-6 rounded-lg shadow-md space-y-4 mt-6">
          <h3 className="text-xl font-semibold">Grand Summary</h3>
          <p><strong>Total Fuel Sales:</strong> ₹{totalFuelSales.toFixed(0)}</p>
          <p><strong>Total Indent Sales:</strong> ₹{totalIndent.toFixed(0)}</p>
          <p><strong>Total Lubricants:</strong> ₹{totalLubricants.toFixed(0)}</p>
          <p><strong>Total Expenses:</strong> ₹{totalExpenses.toFixed(0)}</p>
          <p><strong>Total Cash:</strong> ₹{cashTotal.toFixed(0)}</p>
          <p><strong>Total Payment:</strong> ₹{totalReceipt.toFixed(0)}</p>
          <p><strong>Excess / Shortage:</strong> ₹{excessOrShort.toFixed(0)}</p>
        </section>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Download Report
        </button>
      </div>

    </div>
  );
}