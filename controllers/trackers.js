const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Tracker = require('../models/Tracker');

// @desc      Create new tracker
// @route     POST /api/v1/trackers
// @access    Private
exports.addTracker = asyncHandler(async(req, res, next) => {
    const { user, course, data } = req.body;

    let tracker = await Tracker.findOne({ user: user });
    if(tracker){
        // update tracker
        const courseIndex = tracker.courses.findIndex(item => {
            return item.course.toString() === course;
        })

        let newCourses = tracker.courses;

        if(courseIndex >= 0){
            // update course in array
            newCourses[courseIndex].data = data;
        } else {
            // add more course to array
            newCourses.push({
                "course": course,
                "data": data 
            })
        }
        await Tracker.updateOne({ user: user }, { $set: { courses: newCourses }});
        await res.status(200).json({
            success: true
        })
    } else {
        // create tracker
        const dataObj = {
            "user": user,
            "courses": [
                {
                    "course": course,
                    "data": data
                }
            ]
        }
        await Tracker.create(dataObj);
        await res.status(200).json({
        success: true
    })
    }    
})
