import * as Yup from 'yup';

// Common reusable validation rules
const nonEmptyString = (fieldName: string) =>
    Yup.string()
        .trim()
        .required(`${fieldName} is required`)
        .test('non-empty', `${fieldName} cannot be empty`, (value) => (value ?? '').trim() !== '');

const positiveNumber = (fieldName: string) =>
    Yup.number()
        .required(`${fieldName} is required`)
        .test('positive', `${fieldName} must be greater than 0`, (value) => (value ?? 0) > 0);

const isInitialState = (entry: { customerName: string; vehicleNumber: string; fuelType: string; quantity: number; slipNumber: number; time: string; }) => {
    return (
        entry.customerName === '' &&
        entry.vehicleNumber === '' &&
        entry.fuelType === 'MS' &&
        entry.quantity === 0 &&
        entry.slipNumber === 0 &&
        entry.time === ''
    );
};

// Validation schemas
export const validationSchemas = {
    shift: Yup.object({
        attendants: Yup.array()
            .of(nonEmptyString('Attendant name'))
            .min(1, 'At least one attendant is required'),
        shiftTime: nonEmptyString('Shift time'),
        date: nonEmptyString('Date'),
        dispenser: positiveNumber('Dispenser'),
        fuelPrices: Yup.object({
            HSD: positiveNumber('HSD price'),
            MS: positiveNumber('MS price'),
        }),
        readings: Yup.array()
            .of(
                Yup.object({
                    nozzle: positiveNumber('Nozzle number'),
                    fuelType: nonEmptyString('Fuel type'),
                    opening: Yup.number()
                        .required('Opening reading is required')
                        .test('non-negative', 'Opening reading must be 0 or greater', (value) => value >= 0),
                    closing: Yup.number()
                        .required('Closing reading is required')
                        .test('greater-than-opening', function (value) {
                            const { opening, nozzle } = this.parent;
                            return value > opening || this.createError({ message: `Nozzle ${nozzle}: Closing reading must be greater than opening reading` });
                        }),
                    testQty: Yup.number()
                        .required('Test quantity is required')
                        .test('non-negative', 'Test quantity must be 0 or greater', (value) => value >= 0)
                        .test('less-than-total', function (value) {
                            const { opening, closing, nozzle } = this.parent;
                            return value <= closing - opening || this.createError({ message: `Nozzle ${nozzle}: Test quantity must be less than total quantity` });
                        }),
                })
            )
            .when('dispenser', {
                is: 1,
                then: (schema) => schema.min(2, 'At least two readings are required for dispenser 1'),
                otherwise: (schema) =>
                    schema.when('dispenser', {
                        is: 2,
                        then: (s) => s.min(4, 'At least four readings are required for dispenser 2'),
                        otherwise: (s) => s.min(1, 'At least one reading is required'),
                    }),
            }),
    }),

    lubricant: Yup.array()
        .of(
            Yup.object({
                name: nonEmptyString('Lubricant name'),
                price: positiveNumber('Price'),
                quantity: Yup.number()
                    .required('Quantity is required')
                    .test('non-negative', 'Quantity must be 0 or greater', (value) => value >= 0),
            })
        ),

    indent: Yup.array()
        .of(
            Yup.object({
                customerName: Yup.string().test('non-empty', function (value) {
                    const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10); // Extract index from path
                    const entry = this.parent;

                    // Skip validation if entry is still in the initialized state
                    if (isInitialState(entry)) return true;

                    // Validate customerName if the entry has been modified
                    return (value ?? '').trim() !== '' || this.createError({ message: `Indent Entry ${index + 1} : Customer name is required` });
                }),

                vehicleNumber: Yup.string().test('non-empty', function (value) {
                    const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10); // Extract index from path
                    const entry = this.parent;

                    // Skip validation if entry is still in the initialized state
                    if (isInitialState(entry)) return true;

                    // Validate vehicleNumber if the entry has been modified
                    return (value ?? '').trim() !== '' || this.createError({ message: `Indent Entry ${index + 1} : Vehicle number is required` });
                }),

                fuelType: Yup.string().test('non-empty', function (value) {
                    const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10); // Extract index from path
                    const entry = this.parent;

                    // Skip validation if entry is still in the initialized state
                    if (isInitialState(entry)) return true;

                    // Validate fuelType if the entry has been modified
                    return (value ?? '').trim() !== '' || this.createError({ message: `Indent Entry ${index + 1} : Fuel type is required` });
                }),

                quantity: Yup.number().test('positive-quantity', function (value) {
                    const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10); // Extract index from path
                    const entry = this.parent;

                    // Skip validation if entry is still in the initialized state
                    if (isInitialState(entry)) return true;

                    // Validate positive quantity if the entry has been modified
                    return (value ?? 0) > 0 || this.createError({ message: `Indent Entry ${index + 1} : Quantity must be greater than 0` });
                }),

                slipNumber: Yup.number().test('positive-slip', function (value) {
                    const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10); // Extract index from path
                    const entry = this.parent;

                    // Skip validation if entry is still in the initialized state
                    if (isInitialState(entry)) return true;

                    // Validate slipNumber if the entry has been modified
                    return (value ?? 0) > 0 || this.createError({ message: `Indent Entry ${index + 1} : Slip number must be greater than 0` });
                }),

                time: Yup.string().test('non-empty', function (value) {
                    const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10); // Extract index from path
                    const entry = this.parent;

                    // Skip validation if entry is still in the initialized state
                    if (isInitialState(entry)) return true;

                    // Validate time if the entry has been modified
                    return (value ?? '').trim() !== '' || this.createError({ message: `Indent Entry ${index + 1} : Time is required` });
                }),
            })
        ),
    expense: Yup.array()
        .of(
            Yup.object({
                expenseName: Yup.string().test('non-empty', function (value) {
                    const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10);
                    const entry = this.parent;

                    // Skip validation if both fields are still in their initialized state
                    if (entry && entry.expenseName.trim() === '' && entry.amount === 0) {
                        return true;
                    }

                    return (value ?? '').trim() !== '' || this.createError({ message: `Expense Entry ${index + 1}: Expense Name is required` });
                }),
                amount: Yup.number()
                    .test('positive-amount', function (value) {
                        const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10);
                        const entry = this.parent;

                        // Skip validation if both fields are still in their initialized state
                        if (entry && entry.expenseName.trim() === '' && entry.amount === 0) {
                            return true;
                        }

                        return (value ?? 0) > 0 || this.createError({ message: `Expense Entry ${index + 1}: Amount must be greater than 0` });
                    })
                    .required('Amount is required'),
            })
        ),

    receipt: Yup.object({
        denominations: Yup.object({
            500: Yup.number().min(0, 'Denomination cannot be negative'),
            200: Yup.number().min(0, 'Denomination cannot be negative'),
            100: Yup.number().min(0, 'Denomination cannot be negative'),
            50: Yup.number().min(0, 'Denomination cannot be negative'),
            20: Yup.number().min(0, 'Denomination cannot be negative'),
            10: Yup.number().min(0, 'Denomination cannot be negative'),
        }),
        coins: Yup.number().min(0, 'Coins cannot be negative'),
        paytm: Yup.number().min(0, 'Paytm amount cannot be negative'),
        swipe: Yup.number().min(0, 'Swipe amount cannot be negative'),
        scheme: Yup.number().min(0, 'Scheme amount cannot be negative'),
    }),
};