const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Register new user
// @route     POST /api/v1/users
// @access    Private
exports.registerUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    sendTokenResponse(user, 200, res);
})

// @desc      Get users
// @route     Get /api/v1/auth
// @access    Public
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    await res.status(200).json({
        success: true,
        data: users
    })
})

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate emil & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
})

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
        success: true,
        token: token
    })
}

// @desc      Get current logged in user
// @route     Get /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    await res.status(200).json({
        success: true,
        data: user
    })
})

// @desc      Add course to cart
// @route     Put /api/v1/auth/addToCart
// @access    Public
exports.addToCart = asyncHandler(async(req, res, next) => {
    const { userId, courseId } = req.body;

    const user = await User.findById({ _id: userId });
    const cartCourseIndex = await user.cart.items.findIndex(p => {
        return p.courseId.toString() === courseId.toString();
    })
    let updatedCartItems = [...user.cart.items];
    if(cartCourseIndex >= 0){
        return next(new ErrorResponse(`This course already added to card`, 400));
    } else {
        updatedCartItems.push({ courseId: courseId});
    }

    const updatedCart = {
        items: updatedCartItems
    };

    await User.updateOne({ _id: userId }, { $set: { cart: updatedCart }});
    await res.status(200).json({
        success: true
    })
})

// @desc      Delete course item from cart
// @route     Put /api/v1/auth/deleteCardItem
// @access    Public
exports.deleteCardItem = asyncHandler(async (req, res, next) => {
    const { userId, courseId } = req.body;

    const user = await User.findById({ _id: userId });
    // const cartCourseIndex = await user.cart.items.findIndex(p => {
    //     return p.courseId.toString() === courseId.toString();
    // })
    // let updatedCartItems = [...user.cart.items];
    // if(cartCourseIndex >= 0){
    //     updatedCartItems = updatedCartItems.splice(cartCourseIndex, 1);
    // }

    const updatedCartItems = user.cart.items.filter(item => {
        return item.courseId.toString() !== courseId.toString();
    })

    const updatedCart = {
        items: updatedCartItems
    };

    await User.updateOne({ _id: userId }, { $set: { cart: updatedCart }});
    await res.status(200).json({
        success: true
    })
})

// @desc      Clear cart
// @route     Put /api/v1/auth/clearCart
// @access    Public
exports.clearCart = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;
    const cartItems = {
        items: []
    };

    await User.updateOne({ _id: userId }, { $set: { cart: cartItems }});
    await res.status(200).json({
        success: true
    })
})
