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

export type ReceiptData = {
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
    receipt: ReceiptData;
};
