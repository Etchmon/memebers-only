var User = require('../models/user');
var Message = require('../models/message');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const passport = require("passport");
var async = require('async');

exports.sign_up = [
    // Validate and sanitize data
    body("username").trim().isLength({ min: 5 }).escape().withMessage("Username must be at least 5 characters."),
    body("password").trim().isLength({ min: 5 }).escape().withMessage("Password must be at least 5 characters."),
    body("confirmPassword").trim().isLength({ min: 5 }).escape().withMessage("Password must be at least 5 characters."),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract validation errors from request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('ERROR');
            res.render('error', { error: errors });
        }
        else {
            // Check db for existing User
            async.parallel({
                user: function (callback) {
                    User.findOne({ "username": req.params.username }).exec(callback)
                }
            }, function (err, results) {
                if (err) { return next(err) };
                // User already exists
                if (results.user) {
                    res.render('index', { title: 'Sign Up', error: 'User already exists' });
                    return;
                };
                // User does not exist, register new User to db.
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    if (err) return next(err);
                    const user = new User({
                        username: req.body.username,
                        password: hashedPassword,
                        member: false,
                        admin: false
                    }).save(err => err ? next(err) : res.redirect("/home"));
                });
            });
        }
    }
];

exports.login_get = (req, res) => {
    // If user is already logged in, redirect them to the homepage
    if (res.locals.currentUser) return res.redirect("/home");
    res.render("log-in-form", { title: "Login" });
};

exports.login_post = passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/log-in"
});

exports.logout_get = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect("/");
    });
};

exports.clubhouse_test = async (req, res, next) => {
    if (!res.locals.currentUser) {
        // Users not logged in cannot access "create a message page"
        return res.redirect("/log-in");
    }

    if (!res.locals.currentUser.member) {
        res.render("memberTest")
    } else {
        const messages = await Message.find().populate('user');

        res.render("clubhouse", { user: req.user, messages: messages });
    }

}

exports.clubhouse_post = [
    // santize data
    body("answer").trim().isLength({ min: 1 }).withMessage("Answer must not be empty"),

    // Process request after validation and sanitization
    (req, res, next) => {
        // Extract validation errors from request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('error', { error: errors })
        } else if (req.body.answer != 'curiosity') {
            return res.render('memberTest', { answerError: 'Wrong answer' })
        };

        const user = new User(res.locals.currentUser);
        user.member = true;

        User.findByIdAndUpdate(res.locals.currentUser._id, user, {}, (err) => {
            if (err) return next(err);
            return res.render('home', { user: req.user });
        })
    }
]

