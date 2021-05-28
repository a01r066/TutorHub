const asyncHandler = require('../middleware/async');
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('../utils/paypalClient');

// @desc      Process the  payment
// @route     Post /api/v1/auth/payments/payment
// @access    Public
exports.processPayment = asyncHandler(async(req, res, next) => {
    // 3. Call PayPal to set up a transaction
    // const totalAmount = req.body.total;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        "intent": "CAPTURE",
        "application_context": {
            "return_url": "https://example.com",
            "cancel_url": "https://example.com",
            "brand_name": "TutorHub Ltd",
            "locale": "en-US",
            "landing_page": "BILLING",
            "shipping_preference": "SET_PROVIDED_ADDRESS",
            "user_action": "CONTINUE"
        },
        "purchase_units": [
            {
                "reference_id": "PUHF",
                "description": "Sporting Goods",

                "custom_id": "CUST-HighFashions",
                "soft_descriptor": "HighFashions",
                "amount": {
                    "currency_code": "USD",
                    "value": "230.00",
                    "breakdown": {
                        "item_total": {
                            "currency_code": "USD",
                            "value": "180.00"
                        },
                        "shipping": {
                            "currency_code": "USD",
                            "value": "30.00"
                        },
                        "handling": {
                            "currency_code": "USD",
                            "value": "10.00"
                        },
                        "tax_total": {
                            "currency_code": "USD",
                            "value": "20.00"
                        },
                        "shipping_discount": {
                            "currency_code": "USD",
                            "value": "10"
                        }
                    }
                },
                "items": [
                    {
                        "name": "T-Shirt",
                        "description": "Green XL",
                        "sku": "sku01",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "90.00"
                        },
                        "tax": {
                            "currency_code": "USD",
                            "value": "10.00"
                        },
                        "quantity": "1",
                        "category": "PHYSICAL_GOODS"
                    },
                    {
                        "name": "Shoes",
                        "description": "Running, Size 10.5",
                        "sku": "sku02",
                        "unit_amount": {
                            "currency_code": "USD",
                            "value": "45.00"
                        },
                        "tax": {
                            "currency_code": "USD",
                            "value": "5.00"
                        },
                        "quantity": "2",
                        "category": "PHYSICAL_GOODS"
                    }
                ],
                "shipping": {
                    "method": "United States Postal Service",
                    "address": {
                        "name": {
                            "full_name": "John",
                            "surname": "Doe"
                        },
                        "address_line_1": "123 Townsend St",
                        "address_line_2": "Floor 6",
                        "admin_area_2": "San Francisco",
                        "admin_area_1": "CA",
                        "postal_code": "94107",
                        "country_code": "US"
                    }
                }
            }]
    });

    let order;
    try {
        order = await payPalClient.client().execute(request);
    } catch (err) {
        // 4. Handle any errors from the call
        console.error(err);
        return res.send(500);
    }

    // 5. Return a successful response to the client with the order ID
    await res.status(200).json({
        orderID: order.result.id
        // result: order
    });
})
