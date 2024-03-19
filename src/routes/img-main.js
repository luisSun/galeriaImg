const express = require('express');
const router = express.Router();
const connection = require('../db/dbimg');


router.get('/img/:index', async (req, res) => {
  const index = req.params.index;
  try {
    const [result] = await connection.query('SELECT * FROM images where id = ?',[index]);


    //console.log(result)
    res.status(200).render('img', { result: result });
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    res.status(500).send('Erro ao consultar o banco de dados');
  }

});

router.post('/update-tags/:id', async (req, res) => {
  const imageId = req.params.id;
  const newTags = req.body.tags;

  // Dividir as tags em linhas
  const lines = newTags.split('\n');
  let formattedTags = '';

  // Processar cada linha
  lines.forEach((line, index) => {
    const tags = line.trim().split(',').map(tag => tag.trim());

    // Remover elementos vazios
    const filteredTags = tags.filter(tag => tag !== '');

    // Verificar e adicionar o prefixo correto para cada linha
    if (index === 0) {
      formattedTags += filteredTags.map(tag => `series:${tag.charAt(0).toUpperCase() + tag.slice(1)}`).join('; ');
    } else if (index === 1) {
      formattedTags += `; ${filteredTags.map(tag => `char:${tag.charAt(0).toUpperCase() + tag.slice(1)}`).join('; ')}`;
    } else if (index === 2) {
      formattedTags += `; misc:${filteredTags.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)).join(', ')}`;
    }
  });

  try {
    await connection.query('UPDATE images SET tags = ? WHERE id = ?', [formattedTags, imageId]);
    const script = `<script>alert("Tags Alteradas"); window.location.href = "/img/${imageId}";</script>`;
    res.status(200).send(script);
  } catch (error) {
    console.error('Failed to update tags:', error);
    res.status(500).send('Failed to update tags');
  }
});


router.get('/get-tag-suggestions', async (req, res) => {
  const tag = req.query.tag.toLowerCase().trim(); // Tag digitada pelo usuário
  try {
    // Consulta SQL para buscar sugestões de tags com base na tag digitada pelo usuário
    const [rows] = await connection.query('SELECT DISTINCT tags FROM images WHERE tags LIKE ?', [`${tag}%`]);

    // Extrai as sugestões de tags da resposta da consulta SQL
    const suggestions = rows.map(row => row.tags);

    res.json({ suggestions });
  } catch (error) {
    console.error('Erro ao buscar sugestões de tags:', error);
    res.status(500).json({ error: 'Erro ao buscar sugestões de tags' });
  }
});



module.exports = router;
