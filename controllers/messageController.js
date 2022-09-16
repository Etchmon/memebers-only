var Message = require('../models/message');
const { body, validationResult } = require("express-validator");

exports.create_message_get = (req, res, next) => {
    if (!res.locals.currentUser) {
        // Users not logged in cannot access "create a message page"
        return res.redirect("/log-in");
    }
    return res.render('createMessage', { user: req.user });
}

exports.create_message_post = [
    body("messageTitle").trim().isLength({ min: 1 }).withMessage("Title must not be empty"),
    body("messageText").trim().isLength({ min: 1 }).withMessage("Text must not be empty"),

    async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("createMessage", { errors: errors.array() });
        }

        const message = new Message({
            user: req.user._id,
            title: req.body.messageTitle,
            text: req.body.messageText,
            timestamp: Date.now()
        })

        await message.save((err) => {
            if (err) return next(err);
            res.redirect("/home");
        });
    }
];