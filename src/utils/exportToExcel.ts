import { utils, writeFile } from 'xlsx';

export const exportToExcel = (
  shift: any,
  receipt: any,
  nozzleRows: any[],
  fuelSummaryRows: any[],
  indentRows: any[],
  lubricantRows: any[],
  denominationRows: any[],
  expenseRows: any[],
  totalFuelSales: number,
  totalIndent: number,
  totalLubricants: number,
  totalExpenses: number,
  cashTotal: number,
  totalReceipt: number,
  excessOrShort: number
) => {
  try {
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
    const formattedDate = `${shiftDate.getDate().toString().padStart(2, '0')}-${(shiftDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${shiftDate.getFullYear().toString().slice(-2)}`;

    // Combine the formatted date, shift time, and "Report"
    const fileName = `${formattedDate}_${shift.shiftTime}_Report.xlsx`;

    const sheet = utils.aoa_to_sheet(data);
    utils.book_append_sheet(wb, sheet, 'Shift Report');
    writeFile(wb, fileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to export the report. Please try again.');
  }
};