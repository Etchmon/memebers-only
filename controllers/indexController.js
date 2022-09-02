var Message = require('../models/message');

exports.index = async (req, res, next) => {
    try {
        // Populate messages to be displayed on homepage.
        const messages = await Message.find().populate('user');
        return res.render('index', { title: 'Sign up', user: req.user, messages: messages });

    } catch (err) {
        return next(err);
    }
}