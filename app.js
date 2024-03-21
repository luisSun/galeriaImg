const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');



const middleware = require('./src/middleware/middleware.js');

const loginRouter = require('./src/routes/loginroute.js');
const homeRouter = require('./src/routes/homeroute.js');
const userRouter = require('./src/routes/userRoute.js');
const upRouter = require('./src/routes/upload.js');
const imgRouter = require('./src/routes/img-main.js');


const PORT = process.env.PORT || 8083;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

app.use(session({
  secret: 'sua_chave_secreta',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 600000 }
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/imgs'));
app.use(express.static(__dirname + '/imgs/temp'));
app.use(express.urlencoded({ extended: false }));

app.use('/im/', middleware.imgMiddleware);

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
app.use('/', homeRouter);
app.use('/', imgRouter);
app.use('/', upRouter);
//app.use('/', userRouter);

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send('<script>alert("TCHAU"); window.location.href = "/login";</script>');
});

app.listen(PORT, () => {
  console.log(`http://127.0.0.1:${PORT}`);
});
