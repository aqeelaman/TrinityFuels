// import * as Yup from 'yup';

// export const validationSchemas = {
//     shift: Yup.object({
//         attendants: Yup.array()
//             .of(Yup.string().required('Attendant name is required'))
//             .min(1, 'At least one attendant is required'),
//         shiftTime: Yup.string().required('Shift time is required'),
//         date: Yup.string().required('Date is required'),
//         dispenser: Yup.number()
//             .required('Dispenser is required')
//             .test('positive-dispenser', 'Dispenser must be greater than 0', (value) => value > 0),
//         fuelPrices: Yup.object({
//             HSD: Yup.number()
//                 .required('HSD price is required')
//                 .test('positive-price', 'HSD price must be greater than 0', (value) => value > 0),
//             MS: Yup.number()
//                 .required('MS price is required')
//                 .test('positive-price', 'MS price must be greater than 0', (value) => value > 0),
//         }),
//         readings: Yup.array()
//             .of(
//                 Yup.object({
//                     nozzle: Yup.number()
//                         .required('Nozzle number is required')
//                         .test('positive-nozzle', 'Nozzle number must be greater than 0', (value) => value > 0),
//                     fuelType: Yup.string().required('Fuel type is required'),
//                     opening: Yup.number()
//                         .required('Opening reading is required')
//                         .test('non-negative', 'Opening reading must be 0 or greater', (value) => value >= 0),
//                     closing: Yup.number()
//                         .required('Closing reading is required')
//                         .test('non-negative', 'Closing reading must be 0 or greater', (value) => value >= 0),
//                     testQty: Yup.number()
//                         .required('Test quantity is required')
//                         .test('non-negative', 'Test quantity must be 0 or greater', (value) => value >= 0),
//                 })
//             )
//             .min(1, 'At least one reading is required'),
//     }),
//     lubricant: Yup.array()
//         .of(
//             Yup.object({
//                 name: Yup.string().required('Lubricant name is required'),
//                 price: Yup.number()
//                     .required('Price is required')
//                     .test('positive-price', 'Price must be greater than 0', (value) => value > 0),
//                 quantity: Yup.number()
//                     .required('Quantity is required')
//                     .test('non-negative', 'Quantity must be 0 or greater', (value) => value >= 0),
//             })
//         )
//         .min(1, 'At least one lubricant entry is required'),
//     indent: Yup.array()
//         .of(
//             Yup.object({
//                 customerName: Yup.string().required('Customer name is required'),
//                 vehicleNumber: Yup.string().required('Vehicle number is required'),
//                 fuelType: Yup.string().required('Fuel type is required'),
//                 quantity: Yup.number()
//                     .required('Quantity is required')
//                     .test('positive-quantity', 'Quantity must be greater than 0', (value) => value > 0),
//                 slipNumber: Yup.number()
//                     .required('Slip number is required')
//                     .test('positive-slip', 'Slip number must be greater than 0', (value) => value > 0),
//                 time: Yup.string().required('Time is required'),
//             })
//         )
//         .test(
//             'non-empty-indent',
//             'Indent entry cannot be empty',
//             (entries) =>
//                 entries?.every(
//                     (entry) =>
//                         entry.customerName !== '' ||
//                         entry.vehicleNumber !== '' ||
//                         entry.fuelType !== '' ||
//                         entry.quantity !== 0 ||
//                         entry.slipNumber !== 0 ||
//                         entry.time !== ''
//                 ) ?? true
//         ),
//     expense: Yup.array()
//         .of(
//             Yup.object({
//                 expenseName: Yup.string().required('Expense name is required'),
//                 amount: Yup.number()
//                     .required('Amount is required')
//                     .test('positive-amount', 'Amount must be greater than 0', (value) => value > 0),
//             })
//         )
//         .test(
//             'non-empty-expense',
//             'Expense entry cannot be empty',
//             (entries) =>
//                 entries?.every(
//                     (entry) =>
//                         entry.expenseName !== '' || entry.amount !== 0
//                 ) ?? true
//         ),
//     receipt: Yup.object({
//         denominations: Yup.object({
//             500: Yup.number().min(0, 'Denomination cannot be negative'),
//             200: Yup.number().min(0, 'Denomination cannot be negative'),
//             100: Yup.number().min(0, 'Denomination cannot be negative'),
//             50: Yup.number().min(0, 'Denomination cannot be negative'),
//             20: Yup.number().min(0, 'Denomination cannot be negative'),
//             10: Yup.number().min(0, 'Denomination cannot be negative'),
//         }),
//         coins: Yup.number().min(0, 'Coins cannot be negative'),
//         paytm: Yup.number().min(0, 'Paytm amount cannot be negative'),
//         swipe: Yup.number().min(0, 'Swipe amount cannot be negative'),
//         scheme: Yup.number().min(0, 'Scheme amount cannot be negative'),
//     }),
// };

import * as Yup from 'yup';

export const validationSchemas = {
    shift: Yup.object({
        attendants: Yup.array()
            .of(Yup.string().required('Attendant name is required'))
            .min(1, 'At least one attendant is required'),
        shiftTime: Yup.string().required('Shift time is required'),
        date: Yup.string().required('Date is required'),
        dispenser: Yup.number().required('Dispenser is required'),
        fuelPrices: Yup.object({
            HSD: Yup.number()
                .required('HSD price is required')
                .test('positive-price', 'HSD price must be greater than 0', (value) => value > 0),
            MS: Yup.number()
                .required('MS price is required')
                .test('positive-price', 'MS price must be greater than 0', (value) => value > 0),
        }),
        readings: Yup.array()
            .of(
                Yup.object({
                    nozzle: Yup.number().required('Nozzle number is required'),
                    fuelType: Yup.string().required('Fuel type is required'),
                    opening: Yup.number()
                        .test(
                            'opening-required',
                            function (value) {
                                const nozzle = this.parent?.nozzle ?? 'Unknown';
                                return value !== undefined || this.createError({ message: `N${nozzle}: Opening reading for nozzle is required` });
                            }
                        )
                        .test(
                            'opening-non-negative',
                            function (value) {
                                const nozzle = this.parent?.nozzle ?? 'Unknown';
                                if (value === undefined) return true;
                                return value >= 0 || this.createError({ message: `N${nozzle}: Opening reading must be 0 or greater` });
                            }
                        ),
                    closing: Yup.number()
                        .test(
                            'closing-required',
                            function (value) {
                                const nozzle = this.parent?.nozzle ?? 'Unknown';
                                return value !== undefined || this.createError({ message: `N${nozzle}: Closing reading is required` });
                            }
                        )
                        .test(
                            'greater-than-opening',
                            function (value) {
                                const { opening, nozzle } = this.parent;
                                if (value === undefined || opening === undefined) return true;
                                return value > opening || this.createError({ message: `N${nozzle}: Closing reading must be greater than opening reading` });
                            }
                        ),
                    testQty: Yup.number()
                        .required('Test quantity is required')
                        .test(
                            'non-negative',
                            'Test quantity must be 0 or greater',
                            (value) => value >= 0
                        )
                        .test(
                            'less-than-total',
                            function (value) {
                                const { opening, closing, nozzle } = this.parent;
                                if (value === undefined || opening === undefined || closing === undefined) return true;
                                return value <= closing - opening || this.createError({ message: `N${nozzle}: Test quantity must be less than total quantity` });
                            }
                        ),
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
                name: Yup.string().required('Lubricant name is required'),
                price: Yup.number()
                    .required('Price is required')
                    .test('positive-price', 'Price must be greater than 0', (value) => value > 0),
                quantity: Yup.number()
                    .required('Quantity is required')
                    .test('non-negative', 'Quantity must be 0 or greater', (value) => value >= 0),
            })
        )
    // .test(
    //     'non-zero-quantity',
    //     'At least one lubricant must have a quantity greater than 0',
    //     (entries) => entries?.some((entry) => entry.quantity > 0) ?? true
    // )
    ,
    indent: Yup.array()
        .of(
            Yup.object({
                customerName: Yup.string()
                    .test('non-empty', function (value) {
                        const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10);  // Extract index from path
                        return (value ?? '').trim() !== '' || this.createError({ message: `Indent Entry ${index + 1} : Customer name is required` });
                    }),
                vehicleNumber: Yup.string()
                    .test('non-empty', function (value) {
                        const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10);  // Extract index from path
                        return (value ?? '').trim() !== '' || this.createError({ message: `Indent Entry ${index + 1} : Vehicle number is required` });
                    }),
                fuelType: Yup.string().required('Fuel type is required'),
                quantity: Yup.number()
                    .required('Quantity is required')
                    .test('positive-quantity',
                        function (value) {
                            const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10);  // Extract index from path
                            return value > 0 || this.createError({ message: `Indent Entry ${index + 1} : Quantity must be greater than 0` });
                        }),
                slipNumber: Yup.number()
                    .required('Slip number is required')
                    .test(
                        'positive-slip',
                        function (value) {
                            const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10);  // Extract index from path
                            return value > 0 || this.createError({ message: `Indent Entry ${index + 1} : Slip number must be greater than 0` });
                        }
                    ),
                time: Yup.string().test('non-empty', function (value) {
                    const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10);  // Extract index from path
                    return (value ?? '').trim() !== '' || this.createError({ message: `Indent Entry ${index + 1} : Time is required` });
                }),
            })
        )
        .test(
            'optional-indent',
            'Indent entries are optional but must be valid if provided',
            (entries) =>
                entries?.every(
                    (entry) =>
                        entry.customerName !== '' ||
                        entry.vehicleNumber !== '' ||
                        entry.fuelType !== '' ||
                        entry.quantity !== 0 ||
                        entry.slipNumber !== 0 ||
                        entry.time !== ''
                ) ?? true
        ),
    expense: Yup.array()
        .of(
            Yup.object({
                expenseName: Yup.string().test('non-empty', function (value) {
                    const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10);  // Extract index from path
                    return (value ?? '').trim() !== '' || this.createError({ message: `Expense Entry ${index + 1} : Expense Name is required` });
                }),
                amount: Yup.number()
                    .required('Amount is required')
                    .test('positive-amount', function (value) {
                        const index = parseInt(this.path.match(/\d+/)?.[0] || '0', 10);  // Extract index from path
                        return value > 0 || this.createError({ message: `Indent Entry ${index + 1} : Amount must be greater than 0` });
                    }),
            })
        )
        .test(
            'optional-expense',
            'Expense entries are optional but must be valid if provided',
            (entries) =>
                entries?.every(
                    (entry) =>
                        entry.expenseName !== '' || entry.amount !== 0
                ) ?? true
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