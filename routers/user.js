const express = require('express');
const router = express.Router();
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const { renderRegister, register, renderLogin, login, logout } = require('../controllers/users');

// Register router
router.get('/register', renderRegister);
router.post('/register', register);

//Login router
router.get('/login', renderLogin);
router.post('/login', storeReturnTo, passport.authenticate('local',
    { failureFlash: true, failureRedirect: '/login' }), login);

router.get('/logout', logout);

module.exports = router;
