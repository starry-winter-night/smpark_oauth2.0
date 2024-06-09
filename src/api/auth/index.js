const auth = require('express').Router();
const authCtrl = require('../../controllers/authController');

auth.get('/register', (req, res) => (res.locals.user ? res.redirect('/oauth/regapp') : res.render('auth/register')));

auth.post('/register', authCtrl.userRegister);

auth.get('/login', (req, res) => (res.locals.user ? res.redirect('/oauth/regapp') : res.render('auth/login')));

auth.post('/login', authCtrl.userLogin);

auth.post('/logout', authCtrl.userLogout);

module.exports = auth;
