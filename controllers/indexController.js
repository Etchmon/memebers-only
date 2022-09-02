var Message = require('../models/message');

exports.index = async (req, res, next) => {
    try {
        // Populate messages to be displayed on homepage.
        const messages = await Message.find().populate('user');
        console.log(messages);
        return res.render('index', { title: 'Sign up', user: req.user, messages: messages });
    } catch (err) {
        return next(err);
    }
}

exports.home = async (req, res, next) => {
    try {
        // Populate messages to be displayed on homepage.
        const messages = await Message.find().populate('user');
        console.log(messages);
        return res.render('home', { user: req.user, messages: messages });
    } catch (err) {
        return next(err);
    }
}

