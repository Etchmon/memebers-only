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

exports.home = async (req, res, next) => {
    if (!res.locals.currentUser) {
        // Users not logged in cannot access "create a message page"
        return res.redirect("/log-in");
    }

    try {
        // Populate messages to be displayed on homepage.
        const messages = await Message.find().populate('user');
        return res.render('home', { user: req.user, messages: messages });
    } catch (err) {
        return next(err);
    }
}

