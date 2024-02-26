const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Use fs.promises para carregar a imagem
const { v4: uuidv4 } = require('uuid');

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

router.get('/upload', (req, res) => {
    const error = req.query.error;
    res.render('upload', { error });
});

router.post('/upload', async (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            // Um erro ocorreu durante o upload
            return res.status(500).json({ message: 'Ocorreu um erro durante o upload dos arquivos.' });
        } else if (err) {
            // Outro tipo de erro ocorreu
            return res.status(500).json({ message: 'Ocorreu um erro inesperado.' });
        }

        const { title, description } = req.body;

        const images = req.files.map(file => file);
        const filenames = images.map(image => image.filename);
        console.log(filenames);
        // Caminho para a pasta de destino
        const destinationPath = 'C:\\Users\\Fernando\\Desktop\\python';

        // Abre o programa olamundo.py para cada imagem enviada
        for (const image of images) {
            // Gera um nome aleatório para a imagem
            const randomName = uuidv4();
            // Obtém a extensão da imagem original
            const ext = path.extname(image.originalname);
            // Constrói o novo caminho da imagem
            const newPath = path.join(destinationPath, randomName + ext);
            const newName = randomName+ext
            // Copia a imagem para o novo caminho
            fs.copyFileSync(image.path, newPath);
            const pythonScriptPath = 'C:\\Users\\Fernando\\Desktop\\python\\olamundo2.py';

            // Executa o script Python com o nome aleatório como parâmetro
            const { exec } = require('child_process');
            exec(`python "${pythonScriptPath}" ${newName}`, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro ao executar o comando: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Erro de execução: ${stderr}`);
                    return;
                }
                console.log(`Saída do comando: ${stdout}`);

                // Insere informações sobre a imagem no banco de dados
                await connection.query('INSERT INTO images (title, description, path) VALUES (?, ?, ?)', [title, description, filenames]);
            });
        }

        res.send('<script>alert("Imagens enviadas com sucesso!"); window.location.href = "/upload";</script>');
    });
});

module.exports = router;