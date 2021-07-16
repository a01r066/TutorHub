const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const path = require('path');
const advancedResults = require('../middleware/advancedResults');
require('dotenv/config');

// @desc      Register new user
// @route     POST /api/v1/users
// @access    Private
exports.registerUser = asyncHandler(async(req, res, next) => {
    let user = await User.findOne({ email: req.body.email });
    if(user){
        // update the user
        if(user.isSocial){
            user = await User.findOneAndUpdate({ email: req.body.email }, req.body);
                sendTokenResponse(user, 200, res);
        } else {
            return await res.json({
                success: false,
                statusCode: 401,
                message: `${user.email} already existed! Please try to login!`
            })
        }
    } else {
        user = await User.create(req.body);
        sendTokenResponse(user, 200, res);
    }
})

// @desc      Update user profile
// @route     PUT /api/v1/auth/:id
// @access    Private
exports.updateProfile = asyncHandler(async(req, res, next) => {
    const uid = req.params.id;
    await User.findByIdAndUpdate({ _id: uid }, req.body);
    res.status(200).json({
        success: true
    })
})

// @desc      Upload user photo
// @route     PUT /api/v1/auth/:id/photo
// @access    Private
exports.userPhotoUpload = asyncHandler(async(req, res, next) => {
    const user = await User.findById({ _id: req.params.id });
    console.log('req: '+req.body);
    if(!user){
        return next(new ErrorResponse(`No user with the id ${req.params.id}`, 404));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file!`, 400));
    }

    const file = req.files.file;
    console.log('file: '+file);

    // Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image file!`, 400));
    }

    // Check filesize
    if(file.size > process.env.PHOTO_UPLOAD_FILE_SIZE){
        return next(new ErrorResponse(`File size must be less than ${process.env.PHOTO_UPLOAD_FILE_SIZE}`, 400));
    }

    // Create custom filename
    file.name = `photo_${user._id}${path.parse(file.name).ext}`;

    const filePath = `${process.env.UPLOAD_PATH}/users/${file.name}`;
    await file.mv(filePath, err => {
        if(err){
            return next(err);
        }
    })

    await User.findByIdAndUpdate({ _id: req.params.id }, { photoURL: file.name });

    await res.status(200).json({
        success: true
    })
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
    //         select: 'title description photo tuition slug',
    //     }});

    await res.status(200).json(res.advancedResults);
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
        path: 'cart purchased_courses wishlist', 
        populate: {
            path: 'courseId',
            select: 'title description photo tuition slug instructor'
            // populate: { 
            //     path: 'coupon'
            // }
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

// @desc      Get current logged in user
// @route     Get /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await (await User.findById(req.user.id))
    .populate({ 
        path: 'cart purchased_courses wishlist', 
        populate: {
            path: 'courseId',
            select: 'title description photo tuition slug instructor',
            populate: { 
                path: 'coupon instructor'
            }
        } })
        .execPopulate();
    await res.status(200).json({
        success: true,
        data: user
    })
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

// @desc      Add course to wishlist
// @route     Put /api/v1/auth/addToWishlist
// @access    Private
exports.updateWishlist = asyncHandler(async(req, res, next) => {
    const { userId, courseId } = req.body;

    const user = await User.findById({ _id: userId });
    const courseIndex = await user.wishlist.findIndex(p => {
        return p.courseId.toString() === courseId.toString();
    })
    let updatedWishlist = [...user.wishlist];
    if(courseIndex >= 0){
        // remove course from wishlist
        updatedWishlist.splice(courseIndex, 1);
        // return next(new ErrorResponse(`This course already added to wishlist`, 400));
    } else {
        // add course to wishlist
        updatedWishlist.push({ courseId: courseId});
    }

    await User.updateOne({ _id: userId }, { $set: { wishlist: updatedWishlist }});
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
