const express = require('express');
const router = express.Router();
const connection = require('../db/dbimg');


router.get(['/','/main','/home'], async (req, res) => {
  try {
    const [result] = await Promise.all([
      connection.promise().query('SELECT * FROM images order by id DESC'),
    ]);
    res.status(200).render('main', { result: result[0]});
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    res.status(500).send('Erro ao consultar o banco de dados');
  }
});


module.exports = router;
