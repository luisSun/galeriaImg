const express = require('express');
const router = express.Router();
const connection = require('../db/dbimg');


router.get(['/','/main','/home'], async (req, res) => {
  try {
    const perPage = 12; // Itens por página
    const currentPage = req.query.page || 1; // Página atual, padrão é a primeira página
    const [count] = await connection.query('SELECT COUNT(*) AS total FROM images');
    const totalItems = count[0].total; // Total de itens na tabela
    const totalPages = Math.ceil(totalItems / perPage); // Total de páginas

    const offset = (currentPage - 1) * perPage;
    const [result] = await connection.query('SELECT * FROM images ORDER BY id DESC LIMIT ?, ?', [offset, perPage]);

    res.status(200).render('main', { result: result, totalPages: totalPages, currentPage: currentPage });
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    res.status(500).send('Erro ao consultar o banco de dados');
  }
});

router.get('/pag/1', (req, res) => {
  res.redirect('/main');
});

router.get('/pag/:page', async (req, res) => {
  const perPage = 12; // Itens por página
  const currentPage = req.params.page || 1; // Página atual, padrão é a primeira página
  const [count] = await connection.query('SELECT COUNT(*) AS total FROM images');
  const totalItems = count[0].total; // Total de itens na tabela
  const totalPages = Math.ceil(totalItems / perPage); // Total de páginas

  const offset = (currentPage - 1) * perPage;
  const [result] = await connection.query('SELECT * FROM images ORDER BY id DESC LIMIT ?, ?', [offset, perPage]);

  res.status(200).render('main', { result: result, totalPages: totalPages, currentPage: currentPage });
});


router.get('/tags/:index', async (req, res) => {
  const perPage = 12; // Itens por página
  const currentPage = req.query.page || 1; // Página atual, padrão é a primeira página
  const index = req.params.index;

  try {
    // Consulta o total de itens com a tag específica
    const [count] = await connection.query('SELECT COUNT(*) AS total FROM images WHERE tags LIKE ?', [`%${index}%`]);
    const totalItems = count[0].total; // Total de itens com a tag específica
    const totalPages = Math.ceil(totalItems / perPage); // Total de páginas

    const offset = (currentPage - 1) * perPage;
    // Consulta os itens com a tag específica, com paginação
    const [result] = await connection.query('SELECT * FROM images WHERE tags LIKE ? ORDER BY id DESC LIMIT ?, ?', [`%${index}%`, offset, perPage]);

    res.status(200).render('main', { result: result, totalPages: totalPages, currentPage: currentPage });
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    res.status(500).send('Erro ao consultar o banco de dados');
  }
});



module.exports = router;
