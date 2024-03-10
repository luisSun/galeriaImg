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

router.post('/update-tags/:id', async (req, res) => {
  const imageId = req.params.id;
  const newTags = req.body.tags; // Assuming 'tags' is the key for the updated tags

  try {
      await connection.query('UPDATE images SET tags = ? WHERE id = ?', [newTags, imageId]);
      const script = `<script>alert("Tags Alteradas"); window.location.href = "/img/${imageId}";</script>`;
      res.status(200).send(script);
  } catch (error) {
      console.error('Failed to update tags:', error);
      res.status(500).send('Failed to update tags');
  }
});


module.exports = router;
