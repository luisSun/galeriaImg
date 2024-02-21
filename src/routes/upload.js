const express = require('express');
const router = express.Router();

const multer = require('multer');
const path = require('path');

const connection = require('../db/dbimg');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'imgs/'); // Pasta de destino
  },
  filename: function (req, file, cb) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const extension = path.extname(file.originalname);
      const filename = `${year}${month}${day}${hours}${minutes}${seconds}${extension}`;
      cb(null, filename);
  }
});


const upload = multer({ storage: storage });

router.get('/upload', (req, res) => {
  res.render('upload');
});

// Rota de upload de imagens
router.post('/upload', upload.single('image'), (req, res) => {
    const { title, description } = req.body;
    const imagePath = req.file.filename;
  
    // Insere informações sobre a imagem no banco de dados
    connection.query('INSERT INTO images (title, description, path) VALUES (?, ?, ?)', [title, description, imagePath], (err, result) => {
      if (err) {
        console.error('Erro ao inserir imagem:', err);
        return res.status(500).send('Erro ao inserir imagem');
      }
  
      res.status(200).send('Imagem enviada com sucesso');
    });
  });

module.exports = router;
