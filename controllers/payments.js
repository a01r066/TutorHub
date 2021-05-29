const asyncHandler = require('../middleware/async');
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('../utils/paypalClient');
const Payment = require('../models/Payment');

// @desc      Create the  payment
// @route     Post /api/v1/auth/payments
// @access    Public
exports.createPayment = asyncHandler(async(req, res, next) => {
    // 3. Call PayPal to set up a transaction
    // const totalAmount = req.body.total;
    // const return_url = `${req.protocol}://${req.get('host')}:4200`;
    // const cancel_url = `${req.protocol}://${req.get('host')}:4200`;
    // purchase_units = [];
    // const request = new paypal.orders.OrdersCreateRequest();
    // request.prefer("return=representation");
    // request.requestBody({
    //     "intent": "CAPTURE",
    //     "application_context": {
    //         "return_url": return_url,
    //         "cancel_url": cancel_url,
    //         "brand_name": "TutorHub Ltd",
    //         "locale": "en-US",
    //         "landing_page": "BILLING",
    //         "shipping_preference": "SET_PROVIDED_ADDRESS",
    //         "user_action": "CONTINUE"
    //     },
    //     "purchase_units": purchase_units
    // });
    // let order;
    // try {
    //     order = await payPalClient.client().execute(request);
    // } catch (err) {
    //     // 4. Handle any errors from the call
    //     console.error(err);
    //     return res.send(500);
    // }

    // 5. Return a successful response to the client with the order ID
    const payment = await Payment.create(req.body);
    await res.status(200).json({
        success: true,
        order: payment
    });
})

// @desc      Get payments
// @route     Get /api/v1/auth/payments/:userId
// @access    Public
exports.getPayments = asyncHandler(async(req, res, next) => {
    const payments = await Payment.find({ user: req.params.userId });
    await res.status(200).json({
        success: true,
        data: payments
    })
})
