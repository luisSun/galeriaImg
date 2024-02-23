const express = require('express');
const router = express.Router();
const connection = require('../db/dbimg');


router.get(['/','/main','/home'], async (req, res) => {
  try {
    const [result] = await connection.query('SELECT * FROM images order by id DESC');
    res.status(200).render('main', { result: result });
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    res.status(500).send('Erro ao consultar o banco de dados');
  }
});

router.get('/tags/:index', async (req, res) => {
  const index = req.params.index;
  try {
    // Executa o LIKE na tabela para encontrar registros que contenham a tag 'Overlord'
    const [item] = await connection.query('SELECT id FROM images WHERE tags LIKE ?', [`%${index}%`]);

    // Exibe os resultados brutos da consulta no console
    //console.log(item);

    // Mapeia os resultados para retornar apenas os ids
    // Retorna os ids encontrados
    const ids = item.map((row) => row.id);

    // Faz a segunda query para obter os itens com os ids encontrados
    const [result] = await connection.query('SELECT * FROM images WHERE id IN (?)', [ids]);

    //console.log(result);

    res.status(200).render('main', { result: result });
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    res.status(500).send('Erro ao consultar o banco de dados');
  }
});



module.exports = router;
