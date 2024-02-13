const express = require('express');
const router = express.Router();
const passport = require('../config/passport.js');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth');

router.get('/', (req, res) => {
  res.render('main');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/',
}));

router.get('/admin', (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next(); // Passa para a próxima função de middleware se o usuário for um administrador
  }
  // Se o usuário não for um administrador, redireciona para a página home
  res.redirect('/home');
}, (req, res) => {
  res.render('admin', { user: req.user });
});

router.get('/home', ensureAuthenticated, (req, res) => {
  res.render('paginap', { user: req.user });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
