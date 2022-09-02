var express = require('express');
var router = express.Router();
var user_controller = require('../controllers/userController');
var auth_controller = require('../controllers/authController');
var index_controller = require('../controllers/indexController');
var message_controller = require('../controllers/messageController');

/// ----- INDEX ----- ///
router.get('/', index_controller.index);

/// ----- HOMEPAGE ----- ///
router.get('/home', index_controller.home);

/// ----- SIGNUP ----- ///
router.post('/', auth_controller.sign_up);

/// ----- LOGIN/LOGOUT ----- ///
router.get("/log-in", auth_controller.login_get);
router.post("/log-in", auth_controller.login_post);
router.get("/log-out", auth_controller.logout_get);

/// ----- BECOME A MEMBER ----- ///

/// ----- MESSAGE ----- ///
router.get("/create-message", message_controller.create_message_get);

/// ----- ADMIN ----- ///

router.get('/error', function (req, res, next) {
  res.render('error', { title: 'Express' });
});

module.exports = router;
