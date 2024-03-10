const express = require('express');
const router = express.Router();
const connection = require('../db/dbimg');


router.get('/img/:index', async (req, res) => {
  const index = req.params.index;
  try {
    const [result] = await connection.query('SELECT * FROM images where id = ?',[index]);


    console.log(result)
    res.status(200).render('img', { result: result });
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    res.status(500).send('Erro ao consultar o banco de dados');
  }

});

module.exports = router;
