var Message = require('../models/message');

exports.create_message_get = (req, res, next) => {
    return res.render('createMessage', { user: req.user });
}