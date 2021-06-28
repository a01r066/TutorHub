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

// @desc      Get tracker
// @route     GET /api/v1/trackers/:userId/:courseId
// @access    Private
exports.getTracker = asyncHandler(async(req, res, next) => {
    const userId = req.params.userId;
    const courseId = req.params.courseId;

    const tracker = await Tracker.findOne({ user: userId });
    if(tracker){
        const courses = tracker.courses;
        const itemIndex = courses.findIndex(item => item.course.toString() === courseId);
        if(itemIndex >= 0){
            await res.status(200).json({
                success: true,
                data: courses[itemIndex].data
            })
        } else {
            res.status(404).json({
                success: false,
                data: {}
            })
        }
    } else {
        res.status(404).json({
            success: false,
            data: {}
        })
    }
})