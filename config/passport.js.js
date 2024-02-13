const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../data/users');

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

module.exports = passport;
