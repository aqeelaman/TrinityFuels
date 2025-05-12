'use client'

import { useState } from "react";
import PaymentEntry from "../../components/Attendant/PaymentEntry";
import ShiftEntry from "../../components/Attendant/ShiftEntry";
import ExpenseEntry from "../../components/Attendant/ExpenseEntry";
import IndentEntry from "../../components/Attendant/IndentEntry";
import LubricantsSale from "../../components/Attendant/LubricantsSale";
import DayReport from "../../components/Attendant/DayReport";

export default function Attendant() {

    const [activeForm, setActiveForm] = useState("shift");
    const [step, setStep] = useState(0);


    // Centralized form state
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
        fuelPrices: { HSD: number; MS: number };
        readings: Reading[];
    };

    type IndentSaleEntry = {
        customerName: string;
        vehicleNumber: string;
        fuelType: FuelType;
        quantity: number;
        slipNumber: number;
        time: string;
    };

    type PaymentData = {
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


    const [shiftData, setShiftData] = useState<ShiftData>({
        attendants: [],
        shiftTime: 'morning',
        date: new Date().toISOString().split('T')[0],
        dispenser: 1,
        fuelPrices: { HSD: 88.20, MS: 102.34 },
        readings: [{
            nozzle: 1,
            fuelType: 'MS',
            opening: 0,
            closing: 0,
            testQty: 0,
        },
        {
            nozzle: 2,
            fuelType: 'HSD',
            opening: 0,
            closing: 0,
            testQty: 0,
        }],
    });


    const [lubricantsData, setLubricantsData] = useState([
        { name: 'Engine Oil 1L', price: 320, quantity: 0 },
        { name: 'Gear Oil 500ml', price: 180, quantity: 0 },
        { name: 'Coolant 1L', price: 210, quantity: 0 },
    ]);

    const [indentData, setIndentData] = useState<IndentSaleEntry[]>([
        {
            customerName: "",
            vehicleNumber: "",
            fuelType: "MS",
            quantity: 0,
            slipNumber: 0,
            time: "",
        },
    ]);

    const [expensesData, setExpensesData] = useState([
        { expenseName: "", amount: 0 }
    ]);

    const [paymentData, setpaymentData] = useState<PaymentData>({
        denominations: { 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 },
        coins: 0,
        paytm: 0,
        swipe: 0,
        scheme: 0,
    });

    const formOrder = ["shift", "lubricant", "indent", "expense", "payment", "report"];

    const nextStep = () => {
        const currentIndex = formOrder.indexOf(activeForm);
        if (currentIndex < formOrder.length - 1) {
            setActiveForm(formOrder[currentIndex + 1]);
            setStep(currentIndex + 1);
        }
    };

    const prevStep = () => {
        const currentIndex = formOrder.indexOf(activeForm);
        if (currentIndex > 0) {
            setActiveForm(formOrder[currentIndex - 1]);
            setStep(currentIndex - 1);
        }
    };

    const renderForm = () => {
        switch (activeForm) {
            case "shift":
                return <ShiftEntry data={shiftData} setData={setShiftData} />;
            case "lubricant":
                return <LubricantsSale data={lubricantsData} setData={setLubricantsData} />;
            case "indent":
                return <IndentEntry data={indentData} setData={setIndentData} />;
            case "expense":
                return <ExpenseEntry data={expensesData} setData={setExpensesData} />;
            case "payment":
                return <PaymentEntry data={paymentData} setData={setpaymentData} />;
            case "report":
                return (
                    <DayReport
                        report={{
                            shift: shiftData,
                            lubricants: lubricantsData,
                            indent: indentData,
                            expenses: expensesData,
                            payment: paymentData,
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <aside className="w-60 bg-white shadow-md p-4 space-y-2">
                <h1 className="text-xl font-bold mb-6">⛽ Trinity Fuels Adyar Shift Manager</h1>
                {formOrder.map((form, index) => (
                    <button
                        key={form}
                        onClick={() => {
                            setActiveForm(form);
                            setStep(index);
                        }}
                        className={`w-full py-3 px-4 rounded-lg ${activeForm === form
                            ? 'bg-blue-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                            } text-white transition-colors`}
                    >
                        {form.charAt(0).toUpperCase() + form.slice(1)} {form === "report" ? "Review" : "Entry"}
                    </button>
                ))}
            </aside>
            <main className="flex-1 p-6 overflow-y-auto flex flex-col">
                {renderForm()}
                <div className="mt-auto flex justify-end gap-4">
                    {step > 0 && step < formOrder.length - 1 && (
                        <button
                            onClick={prevStep}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
                        >
                            ⬅️ Previous
                        </button>
                    )}
                    {step < formOrder.length - 1 && (
                        <button
                            onClick={nextStep}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors ml-auto"
                        >
                            Next ➡️
                        </button>
                    )}
                </div>
            </main>
        </>
    );
}
