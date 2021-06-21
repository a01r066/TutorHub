const Course = require('../models/Course');

// @desc      Get share course by id
// @route     Get /share/:courseId
// @access    Public
exports.shareCourse = async(req, res, next) => {
    const course = await Course.findById({ _id: req.params.courseId });
    await res.render('bot', {
        pageTitle: course.title,
        title: course.title,
        description: course.description.substring(0, 164) + '...',
        photo: `https://api.tutorhub.info:3000/uploads/courses/${course.photo}`,
        url: `https://www.tutorhub.info/course/${course.slug}`
    })
}