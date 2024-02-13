const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const routes = require('./routes/users');
const PORT = process.env.PORT || 8082;

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'seu_secreto_aqui',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado em http://127.0.0.1:${PORT}`);
});
