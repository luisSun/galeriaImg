function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
  
  function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
    }
    res.redirect('/login'); // Ou redirecione para uma página de acesso negado
  }
  
  module.exports = { ensureAuthenticated, ensureAdmin };