var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Sign Up', user: req.user });
});

router.post('/', user_controller.user_sign_up);

router.get('/log-in', function (req, res, next) {
  res.render('log-in-form', { title: 'Log-in' });
});

router.post('/log-in', user_controller.user_log_in);

router.get('/home', function (req, res, next) {
  console.log(req.user);
  res.render('home');
});

router.get('/error', function (req, res, next) {
  res.render('error', { title: 'Express' });
});

module.exports = router;
