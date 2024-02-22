const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // Use fs.promises para carregar a imagem

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

const upload = multer({ storage: storage }).array('images', 10); // 'images' é o nome do campo de upload e 10 é o número máximo de arquivos

// Função para carregar uma imagem e obter seus dados de pixel
async function loadImageData(path) {
    return fs.readFile(path);
}

router.get('/upload', (req, res) => {
    const error = req.query.error;
    res.render('upload', { error });
});


router.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // Um erro ocorreu durante o upload
            return res.status(500).json({ message: 'Ocorreu um erro durante o upload dos arquivos.' });
        } else if (err) {
            // Outro tipo de erro ocorreu
            return res.status(500).json({ message: 'Ocorreu um erro inesperado.' });
        }

        const { title, description } = req.body;

        const images = req.files.map(file => file.filename);

        for (const imagePath of images) {
            // Verifica se a imagem já existe no banco de dados
            const [rows] = await connection.query('SELECT * FROM images');
            const exists = await checkIfImageExists(imagePath, rows);

            if (exists) {
                // Se a imagem já existe, exibe um popup pedindo uma imagem diferente
                return res.send('<script>alert("Imagem já enviada"); window.location.href = "/upload";</script>');
            }

            // Insere informações sobre a imagem no banco de dados
            await connection.query('INSERT INTO images (title, description, path) VALUES (?, ?, ?)', [title, description, imagePath]);
        }

        res.send('<script>alert("Imagens enviadas com sucesso!"); window.location.href = "/upload";</script>');
    });
});


// Função para verificar se uma imagem já existe no banco de dados
async function checkIfImageExists(imagePath, database) {
    const imageData = await loadImageData('imgs/' + imagePath);
    const histogram1 = createHistogram(imageData);

    for (let i = 0; i < database.length; i++) {
        const existingImageData = await loadImageData('imgs/' + database[i].path);
        const histogram2 = createHistogram(existingImageData);

        // Calcula a distância Chi-Squared entre os histogramas das duas imagens
        const distance = calculateChiSquaredDistance(histogram1, histogram2);

        // Define um limite para considerar duas imagens como iguais ou muito parecidas
        const distanceThreshold = 1000;

        if (distance < distanceThreshold) {
            return true;
        }
    }

    return false;
}

// Função para calcular a distância Chi-Squared entre dois histogramas
function calculateChiSquaredDistance(hist1, hist2) {
    let distance = 0;

    for (let i = 0; i < hist1.length; i++) {
        const diff = hist1[i] - hist2[i];
        const sum = hist1[i] + hist2[i];
        if (sum !== 0) {
            distance += (diff * diff) / sum;
        }
    }

    return distance;
}

// Função para criar o histograma de uma imagem
function createHistogram(imageData) {
    const histogram = Array(256).fill(0);

    for (let i = 0; i < imageData.length; i += 4) {
        const grayValue = Math.round((imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3);
        histogram[grayValue]++;
    }

    return histogram;
}

module.exports = router;