const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash'); 
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser'); // Importe o body-parser

const app = express();
const PORT = process.env.PORT || 8082;

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.use(session({
  secret: 'seu_secreto_aqui',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Use o body-parser para analisar dados do corpo da solicitação
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const users = [
  { id: 1, username: 'u', password: '1' }
];

passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('Tentativa de login com usuário:', username, 'e senha:', password);
      const user = users.find(user => user.username === username && user.password === password);
      if (!user) {
        console.log('Credenciais inválidas.');
        return done(null, false, { message: 'Nome de usuário ou senha inválidos.' });
      }
      console.log('Usuário autenticado com sucesso:', user);
      return done(null, user);
    }
  ));

passport.serializeUser((user, done) => {
  console.log('Serializando usuário:', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id);
  console.log('Desserializando usuário com ID:', id);
  done(null, user);
});

app.get('/login', (req, res) => {
  res.render('login', { message: req.flash('error') }); 
});

app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/',
    failureFlash: true
}), (req, res) => {
    console.log('Autenticação falhou, redirecionando para a página principal');
});

app.get('/dashboard', ensureAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('/', (req, res) => {
  res.render('main');
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://127.0.0.1:${PORT}`);
});
