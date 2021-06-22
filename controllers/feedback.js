const asyncHandler = require('../middleware/async');
const Feedback = require('../models/Feedback');
require('dotenv/config');


exports.createFeedback = asyncHandler(async(req, res, next) => {
    // The reason behind this MongoError: E11000 duplicate key error collection: is that. 
    // The index is not present in your collection, in which you are trying insert. 
    // So Solution is to drop that collection and run your program again. --> really frustrated with this error
    let feedback = await Feedback.findOne({ message: req.body.message });
    if(feedback){
        await res.status(401).json({
            success: false,
            message: 'Feedback existed!'
        })
    } else {
        await Feedback.create({ "subject": req.body.subject, "message": req.body.message, "user": req.body.user});
        await res.status(200).json({
            success: true
        })
    }
    
})
