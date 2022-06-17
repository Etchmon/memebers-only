var User = require('../models/user');
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const passport = require("passport");

exports.sign_up = [
    // Validate and sanitize data
    body("username").trim().isLength({ min: 1 }).escape().withMessage("Username must be at least 6 characters."),
    body("password").trim().isLength({ min: 1 }).escape().withMessage("Password must be at least 6 characters."),
    body("confirmPassword").trim().isLength({ min: 1 }).escape().withMessage("Password must be at least 6 characters."),

    // Process request after validation and sanitization
    (req, res, next) => {

        // Extract validation errors from request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('ERROR');
            res.render('error', { confirmationError: 'Passwords must be the same' });
        };

        try {
            const existUser = await User.find({ "username": req.body.username });
            // User already exists.
            if (existUser.length > 0) return res.render('/', { title: 'Sign Up', error: 'User already exists' });
            // If User does not exist, register new User to db.
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) return next(err);
                const user = new User({
                    username: req.body.username,
                    password: hashedPassword,
                    member: false,
                    admin: false
                }).save(err => err ? next(err) : res.redirect("/home"));
            });
        } catch (err) {
            return next(err);
        }
    }
];

exports.login_get = (req, res) => {
    // If user is already logged in, redirect them to the homepage
    if (res.locals.currentUser) return res.redirect("/");
    res.render("log-in-form", { title: "Login" });
};

exports.login_post = passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/log-in",
    // failureFlash: true
});

exports.logout_get = (req, res) => {
    req.logout();
    res.redirect("/");
}