// // src/types.ts

// export type ReportData = {
//     shift: {
//       shiftTime: string;
//       dispenser: string;
//       attendants: string[];
//       fuelPrices: {
//         petrol: number;
//         diesel: number;
//       };
//       nozzles: {
//         nozzle: string;
//         fuelType: string;
//         opening: number;
//         closing: number;
//         saleQty: number;
//         amount: number;
//       }[];
//     };
//     cash: {
//       denominations: {
//         [denomination: string]: number;
//       };
//       coins: number;
//       paytm: number;
//       swipe: number;
//     };
//     indentSales: {
//       customer: string;
//       vehicle: string | null;
//       fuelType: string;
//       qty: number;
//       amount: number;
//       indentSlip: string;
//       time: string;
//     }[];
//     lubricants: {
//       name: string;
//       qty: number;
//       amount: number;
//     }[];
//     expenses: {
//       category: string;
//       amount: number;
//       note?: string;
//     }[];
//   };


// src/types.ts

export type FuelType = 'HSD' | 'MS';

export type Reading = {
    nozzle: number;
    fuelType: FuelType;
    opening: number;
    closing: number;
    testQty: number;
};

export type ShiftData = {
    attendants: string[];
    shiftTime: string;
    date: string;
    dispenser: number;
    fuelPrices: { HSD: number; MS: number };
    readings: Reading[];
};

export type LubricantsData = {
    name: string;
    price: number;
    quantity: number;
};

export type IndentSaleEntry = {
    customerName: string;
    vehicleNumber: string;
    fuelType: FuelType;
    quantity: number;
    slipNumber: number;
    time: string;
};

export type PaymentData = {
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

export type ExpenseData = {
    expenseName: string;
    amount: number;
    note?: string;
};

export type ReportData = {
    shift: ShiftData;
    lubricants: LubricantsData[];
    indent: IndentSaleEntry[];
    expenses: ExpenseData[];
    payment: PaymentData;
};
