const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/db');

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  if (email && senha) {
    db.query('SELECT * FROM users.usersdb WHERE username = ?', [email], async (err, result) => {
      if (err) {
        res.send('Ocorreu um erro ao fazer o login');
      } else {
        if (result.length > 0) {
          const user = result[0];
          const match = await bcrypt.compare(senha, user.password_hash);
          if (match) {
            const nomeUsuario = user.username; 
            req.session.loggedin = true;
            req.session.email = email;
            req.session.tipo_acesso = user.tipo_acesso;
            req.session.username = user.username;
            res.redirect(`/home`);
          } else {
            return res.send('<script>alert("Email ou senha incorretos"); window.location.href = "/login";</script>');
          }
        } else {
          return res.send('<script>alert("Email ou senha incorretos"); window.location.href = "/login";</script>');
        }
      }
    });
  } else {
    res.send('Por favor, informe o email e a senha');
  }
});

module.exports = router;
