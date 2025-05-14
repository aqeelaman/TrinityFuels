'use client';

import { useState, useEffect } from 'react';
import { validationSchemas } from '../../utils/validationSchema';
import { ShiftData, FuelType, Reading, IndentSaleEntry, ReceiptData, ReportData } from '@/types/types';
import ReceiptEntry from '../../components/Attendant/ReceiptEntry';
import ShiftEntry from '../../components/Attendant/ShiftEntry';
import ExpenseEntry from '../../components/Attendant/ExpenseEntry';
import IndentEntry from '../../components/Attendant/IndentEntry';
import LubricantsSale from '../../components/Attendant/LubricantsSale';
import DayReport from '../../components/Attendant/DayReport';

export default function Attendant() {
    const [activeForm, setActiveForm] = useState('shift');
    const [step, setStep] = useState(0);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>({});

    const [shiftData, setShiftData] = useState<ShiftData>({
        attendants: [],
        shiftTime: 'morning',
        date: new Date().toISOString().split('T')[0],
        dispenser: 1,
        fuelPrices: { HSD: 88.20, MS: 102.34 },
        readings: [
            { nozzle: 1, fuelType: 'MS', opening: 0, closing: 0, testQty: 0 },
            { nozzle: 2, fuelType: 'HSD', opening: 0, closing: 0, testQty: 0 },
        ],
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
    //const [indentData, setIndentData] = useState<IndentSaleEntry[]>([]); // Empty by default

    const [expensesData, setExpensesData] = useState([
        { expenseName: "", amount: 0 }
    ]);
    //const [expensesData, setExpensesData] = useState([]); // Empty by default

    const [receiptData, setReceiptData] = useState<ReceiptData>({
        denominations: { 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 },
        coins: 0,
        paytm: 0,
        swipe: 0,
        scheme: 0,
    });

    const formOrder = ['shift', 'lubricant', 'indent', 'expense', 'receipt', 'report'];

    // Fetch initial data for shift, lubricants, and customers
    useEffect(() => {
        async function fetchInitialData() {
            try {
                // Fetch last shift data
                const lastShift = await fetch('/api/last-shift').then((res) => res.json());
                setShiftData((prev) => ({
                    ...prev,
                    fuelPrices: lastShift.fuelPrices,
                    readings: lastShift.readings.map((reading: any) => ({
                        ...reading,
                        opening: reading.closing, // Set opening to last shift's closing
                    })),
                }));

                // Fetch lubricants data
                const lubricants = await fetch('/api/lubricants').then((res) => res.json());
                setLubricantsData(lubricants);

                // Fetch customers (for indents)
                const customers = await fetch('/api/customers').then((res) => res.json());
                // Pass customers to IndentEntry component as needed
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        }

        fetchInitialData();
    }, []);

    // Validation schemas for each form
    const validateForm = async (formName: string) => {
        try {
            const dataToValidate =
                formName === 'shift'
                    ? shiftData
                    : formName === 'lubricant'
                        ? lubricantsData
                        : formName === 'indent'
                            ? indentData
                            : formName === 'expense'
                                ? expensesData
                                : receiptData;

            await validationSchemas[formName as keyof typeof validationSchemas].validate(dataToValidate, { abortEarly: false });
            setFormErrors((prev) => ({ ...prev, [formName]: [] })); // Clear errors for this form
            return true;
        } catch (err: any) {
            console.log(err)
            const errors = err.inner.map((e: any) => e.message); // Collect validation errors
            console.log(errors)
            setFormErrors((prev) => ({ ...prev, [formName]: errors }));
            return false;
        }
    };

    const nextStep = () => {
        const currentIndex = formOrder.indexOf(activeForm);
        if (currentIndex < formOrder.length - 1) {
            validateForm(activeForm);
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

    const handleNavigation = async (formName: string) => {
        if (formName === 'report') {
            // Validate all forms before navigating to DayReport
            await Promise.all(
                formOrder.slice(0, -1).map((form) => validateForm(form))
            );
        }

        setActiveForm(formName);
        setStep(formOrder.indexOf(formName));
    };

    // const handleSubmit = async () => {
    //     const isValid = await validateCurrentStep();
    //     if (isValid) {
    //         console.log('Submitting data:', {
    //             shift: shiftData,
    //             lubricants: lubricantsData,
    //             indent: indentData,
    //             expenses: expensesData,
    //             receipt: receiptData,
    //         });
    //         // Save data to the database here
    //     }
    // };

    const renderForm = () => {
        switch (activeForm) {
            case 'shift':
                return <ShiftEntry data={shiftData} setData={setShiftData} errors={formErrors['shift']} />;
            case 'lubricant':
                return <LubricantsSale data={lubricantsData} setData={setLubricantsData} errors={formErrors['lubricant']} />;
            case 'indent':
                return <IndentEntry data={indentData} setData={setIndentData} errors={formErrors['indent']} />;
            case 'expense':
                return <ExpenseEntry data={expensesData} setData={setExpensesData} errors={formErrors['expense']} />;
            case 'receipt':
                return <ReceiptEntry data={receiptData} setData={setReceiptData} errors={formErrors['receipt']} />;
            case 'report':
                return (
                    <DayReport
                        report={{
                            shift: shiftData,
                            lubricants: lubricantsData,
                            indent: indentData,
                            expenses: expensesData,
                            receipt: receiptData,
                        }}
                        errors={formErrors}
                        onNavigateToForm={handleNavigation}
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
                        onClick={() => handleNavigation(form)}
                        className={`w-full py-3 px-4 rounded-lg ${
                            activeForm === form ? 'bg-blue-800' : 'bg-blue-500 hover:bg-blue-700'
                        } text-white transition-colors`}
                    >
                        {form.charAt(0).toUpperCase() + form.slice(1)} {form === 'report' ? 'Review' : 'Entry'}
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
