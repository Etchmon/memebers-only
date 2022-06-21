var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');
var auth_controller = require('../controllers/authController');

/// ----- HOMEPAGE ----- ///
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Sign Up', user: req.user });
});

router.get('/home', function (req, res, next) {
  res.render('home', { user: req.user });
});

/// ----- SIGNUP ----- ///
router.post('/', auth_controller.sign_up);

/// ----- LOGIN/LOGOUT ----- ///
router.get("/log-in", auth_controller.login_get);
router.post("/log-in", auth_controller.login_post);
router.get("/log-out", auth_controller.logout_get);

/// ----- BECOME A MEMBER ----- ///

/// ----- MESSAGE ----- ///

/// ----- ADMIN ----- ///

router.get('/error', function (req, res, next) {
  res.render('error', { title: 'Express' });
});

module.exports = router;
