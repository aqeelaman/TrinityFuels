'use client';

import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { ShiftData, FuelType, Reading, IndentSaleEntry, PaymentData, ReportData } from '@/types/types';
import PaymentEntry from '../../components/Attendant/PaymentEntry';
import ShiftEntry from '../../components/Attendant/ShiftEntry';
import ExpenseEntry from '../../components/Attendant/ExpenseEntry';
import IndentEntry from '../../components/Attendant/IndentEntry';
import LubricantsSale from '../../components/Attendant/LubricantsSale';
import DayReport from '../../components/Attendant/DayReport';

export default function Attendant() {
    const [activeForm, setActiveForm] = useState('shift');
    const [step, setStep] = useState(0);

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

    const [paymentData, setpaymentData] = useState<PaymentData>({
        denominations: { 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 },
        coins: 0,
        paytm: 0,
        swipe: 0,
        scheme: 0,
    });

    const formOrder = ['shift', 'lubricant', 'indent', 'expense', 'payment', 'report'];

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

    // Validation schemas for each step
    const validationSchemas = {
        shift: Yup.object({
            attendants: Yup.array().of(Yup.string().required('Attendant name is required')),
            shiftTime: Yup.string().required('Shift time is required'),
            date: Yup.string().required('Date is required'),
            dispenser: Yup.number().required('Dispenser is required'),
            fuelPrices: Yup.object({
                HSD: Yup.number().required('HSD price is required'),
                MS: Yup.number().required('MS price is required'),
            }),
            readings: Yup.array().of(
                Yup.object({
                    nozzle: Yup.number().required('Nozzle number is required'),
                    fuelType: Yup.string().required('Fuel type is required'),
                    opening: Yup.number().required('Opening reading is required'),
                    closing: Yup.number().required('Closing reading is required'),
                    testQty: Yup.number().required('Test quantity is required'),
                })
            ),
        }),
        lubricant: Yup.array().of(
            Yup.object({
                name: Yup.string().required('Lubricant name is required'),
                price: Yup.number().required('Price is required'),
                quantity: Yup.number().required('Quantity is required'),
            })
        ),
        indent: Yup.array().of(
            Yup.object({
                customerName: Yup.string().required('Customer name is required'),
                vehicleNumber: Yup.string().required('Vehicle number is required'),
                fuelType: Yup.string().required('Fuel type is required'),
                quantity: Yup.number().required('Quantity is required'),
                slipNumber: Yup.number().required('Slip number is required'),
                time: Yup.string().required('Time is required'),
            })
        ),
        expense: Yup.array().of(
            Yup.object({
                expenseName: Yup.string().required('Expense name is required'),
                amount: Yup.number().required('Amount is required'),
            })
        ),
        payment: Yup.object({
            denominations: Yup.object({
                500: Yup.number(),
                200: Yup.number(),
                100: Yup.number(),
                50: Yup.number(),
                20: Yup.number(),
                10: Yup.number(),
            }),
            coins: Yup.number(),
            paytm: Yup.number(),
            swipe: Yup.number(),
            scheme: Yup.number(),
        }),
    };

    const validateCurrentStep = async () => {
        const currentForm = formOrder[step];
        try {
            const dataToValidate =
                currentForm === 'shift'
                    ? shiftData
                    : currentForm === 'lubricant'
                        ? lubricantsData
                        : currentForm === 'indent' && indentData.length > 0
                            ? indentData
                            : currentForm === 'expense' && expensesData.length > 0
                                ? expensesData
                                : paymentData;

            if (!dataToValidate || (Array.isArray(dataToValidate) && dataToValidate.length === 0)) {
                return true; // Skip validation for empty indents or expenses
            }

            await validationSchemas[currentForm as keyof typeof validationSchemas].validate(dataToValidate);
            return true;
        } catch (err: any) {
            alert(err.message); // Display validation error
            return false;
        }
    };

    // const nextStep = async () => {
    //     const isValid = await validateCurrentStep();
    //     if (isValid) {
    //         const currentIndex = formOrder.indexOf(activeForm);
    //         if (currentIndex < formOrder.length - 1) {
    //             setActiveForm(formOrder[currentIndex + 1]);
    //             setStep(currentIndex + 1);
    //         }
    //     }
    // };

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

    const handleSubmit = async () => {
        const isValid = await validateCurrentStep();
        if (isValid) {
            console.log('Submitting data:', {
                shift: shiftData,
                lubricants: lubricantsData,
                indent: indentData,
                expenses: expensesData,
                payment: paymentData,
            });
            // Save data to the database here
        }
    };

    const renderForm = () => {
        switch (activeForm) {
            case 'shift':
                return <ShiftEntry data={shiftData} setData={setShiftData} />;
            case 'lubricant':
                return <LubricantsSale data={lubricantsData} setData={setLubricantsData} />;
            case 'indent':
                return <IndentEntry data={indentData} setData={setIndentData} />;
            case 'expense':
                return <ExpenseEntry data={expensesData} setData={setExpensesData} />;
            case 'payment':
                return <PaymentEntry data={paymentData} setData={setpaymentData} />;
            case 'report':
                return (
                    <DayReport
                        report={{
                            shift: shiftData,
                            lubricants: lubricantsData,
                            indent: indentData,
                            expenses: expensesData,
                            payment: paymentData,
                        }}
                    // onSubmit={handleSubmit}
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
                            if (index <= step) {
                                setActiveForm(form);
                                setStep(index);
                            }
                        }}
                        className={`w-full py-3 px-4 rounded-lg ${activeForm === form
                            ? 'bg-blue-700'
                            : index <= step
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-gray-400 cursor-not-allowed'
                            } text-white transition-colors`}
                        disabled={index > step}
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
