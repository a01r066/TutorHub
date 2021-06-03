const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Register new user
// @route     POST /api/v1/users
// @access    Private
exports.registerUser = asyncHandler(async(req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if(user){
        // update the user
        user = await User.findOneAndUpdate({ email: req.body.email }, req.body);
        // console.log('user update: '+ user.email);
            sendTokenResponse(user, 200, res);
    } else {
        user = await User.create(req.body);
        // console.log('user create: '+ user.email);
        sendTokenResponse(user, 200, res);
    }
})

// @desc      Get users
// @route     Get /api/v1/auth
// @access    Public
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    // .populate({ 
    //     path: 'cart purchased_courses',
    //     populate: {
    //         path: 'courseId, ',
    //         select: 'title description photo tuition',
    //     }});
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
    const user = await User.findOne({ email }).select('password')
    .populate({ 
        path: 'cart', 
        populate: {
            path: 'courseId',
            select: 'title description photo tuition'
        } });

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

// @desc      Login gmail user via token
// @route     POST /api/v1/auth/glogin
// @access    Public
exports.gLogin = asyncHandler(async(req, res, next) => {
    const { email, accessToken } = req.body;
    const user = await User.findOne({ email: email, accessToken: accessToken });
    if(user){
        await res.status(200).json({
            success: true,
            data: user
        })
    } else {
        await res.status(404).json({
            success: false
        })
    }
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
        token: token,
        data: user
    })
}

// @desc      Get current logged in user
// @route     Get /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await (await User.findById(req.user.id))
    .populate({ 
        path: 'cart purchased_courses', 
        populate: {
            path: 'courseId',
            select: 'title description photo tuition'
        } })
        .execPopulate();
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
    const cartCourseIndex = await user.cart.findIndex(p => {
        return p.courseId.toString() === courseId.toString();
    })
    let updatedCart = [...user.cart];
    if(cartCourseIndex >= 0){
        return next(new ErrorResponse(`This course already added to card`, 400));
    } else {
        updatedCart.push({ courseId: courseId});
    }

    await User.updateOne({ _id: userId }, { $set: { cart: updatedCart }});
    await res.status(200).json({
        success: true
    })
})

// @desc      Delete course item from cart
// @route     Put /api/v1/auth/deleteCardItem
// @access    Public
exports.removeCartItem = asyncHandler(async (req, res, next) => {
    const { userId, courseId } = req.body;

    const user = await User.findById({ _id: userId });
    // const cartCourseIndex = await user.cart.items.findIndex(p => {
    //     return p.courseId.toString() === courseId.toString();
    // })
    // let updatedCartItems = [...user.cart.items];
    // if(cartCourseIndex >= 0){
    //     updatedCartItems = updatedCartItems.splice(cartCourseIndex, 1);
    // }

    const updatedCart = user.cart.filter(item => {
        return item.courseId.toString() !== courseId.toString();
    })

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

    await User.updateOne({ _id: userId }, { $set: { cart: [] }});
    await res.status(200).json({
        success: true
    })
})
