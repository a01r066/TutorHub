const asyncHandler = require('../middleware/async');
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('../utils/paypalClient');
const Payment = require('../models/Payment');
const User = require('../models/User');

// @desc      Create the  payment
// @route     Post /api/v1/auth/payments
// @access    Public
exports.createPayment = (req, res, next) => {
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
    // Old
    // const userId = req.body.user;
    // const courses = req.body.courses;
    // Payment.create(req.body).then(() => {
    //     User.findByIdAndUpdate({ _id: userId }, { purchased_courses : courses, cart: [] }).then(() => {
    //         res.status(200).json({
    //             success: true
    //         });
    //     })
    // });

    // New
    const userId = req.body.user;
    const courses = req.body.courses;

    Payment.create(req.body).then(() => {
        User.findById({ _id: userId }).then(user => {
            let purchased_courses = user.purchased_courses;
            for(let course of courses){
                purchased_courses.push(course);
            }
            
            User.updateOne({ _id: userId }, { $set: { purchased_courses: purchased_courses, cart: [] }}).then(() => {
                res.status(200).json({
                    success: true
                })
            });
        });
    })
}

// @desc      Get payments
// @route     Get /api/v1/auth/payments/:userId
// @access    Public
exports.getPayments = asyncHandler(async(req, res, next) => {
    const userId = req.params.userId;
    const payments = await Payment.find({ user: userId });
    
    await res.status(200).json({
        success: true,
        data: payments
    })
})
