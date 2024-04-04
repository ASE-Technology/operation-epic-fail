const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verify-token');
const registerInputValidator = require('../middlewares/register-input-validator');
const loginInputValidator = require('../middlewares/login-input-validator');
const updateProfileInputValidator = require('../middlewares/update-profile-input-validator');
const controller = require('../controllers/authentication.controller');

router.post('/register', registerInputValidator.validate, controller.register);
router.post('/login', loginInputValidator.validate, controller.login);
router.put('/profile', verifyToken.verify, updateProfileInputValidator.validate, controller.updateProfile);
router.get('/profile', verifyToken.verify, controller.getProfile);

module.exports = router;