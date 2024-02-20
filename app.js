const express = require('express');
const app = express();
const session = require('express-session');

//const middleware = require('./src/middleware');

const loginRouter = require('./src/routes/loginroute.js');
const homeRouter = require('./src/routes/homeroute.js');

const PORT = process.env.PORT || 8082;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.use(session({
  secret: 'sua_chave_secreta',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));

//Exige autentificação
function requireAuth(req, res, next) {
  if (req.session && req.session.loggedin) {
    // Se o usuário estiver autenticado, adicione o nome de usuário à resposta
    res.locals.username = req.session.username;
    return next();
  } else {
    // Se o usuário não estiver autenticado, redirecione para a página de login
    res.redirect('/login');
  }
}

app.use('/', loginRouter);
app.use('/', requireAuth, homeRouter);


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('<script>alert("TCHAU"); window.location.href = "/login";</script>');
});

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
