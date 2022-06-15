var User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require("passport");

exports.user_sign_up = function (req, res, next) {

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        // if err, do something
        if (err) return (next(err));
        // otherwise, store hashedPassword in DB
        const user = new User({
            username: req.body.username,
            password: hashedPassword
        }).save(err => {
            if (err) {
                return next(err);
            }
            res.redirect("/home");
        });
    });
};

exports.user_log_in = function (req, res, next) {
    console.log('foo');
    passport.authenticate('local', {
        successRedirect: "/home",
        failureRedirect: "/error"
    });
    next();
};