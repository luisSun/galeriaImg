const express = require('express');
const router = express.Router();

router.get(['/user', '/user'], (req, res) => {
  res.render('user');
});

module.exports = router;
