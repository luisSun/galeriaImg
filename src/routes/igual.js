const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Use fs.promises para carregar a imagem
const { v4: uuidv4 } = require('uuid');

const connection = require('../db/dbimg');

router.get('/igual', (req, res) => {
    const error = req.query.error;
    res.render('igual', { error });
});

module.exports = router;