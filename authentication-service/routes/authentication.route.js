const express = require('express');
const router = express.Router();
const registerInputValidator = require('../middlewares/register-input-validator');
const loginInputValidator = require('../middlewares/login-input-validator');
const verifyTokenInputValidator = require('../middlewares/verify-token-input-validator');
const controller = require('../controllers/authentication.controller');

router.post('/register', registerInputValidator.validate, controller.register);
router.post('/login', loginInputValidator.validate, controller.login);
router.post('/verify-token', verifyTokenInputValidator.validate, controller.verifyToken);

module.exports = router;