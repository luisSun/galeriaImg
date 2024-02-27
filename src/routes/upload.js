const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const connection = require('../db/dbimg');

//MULTER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'imgs/temp'); // Pasta de destino
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

const upload = multer({ storage: storage }).array('images', 10); 
// 'images' é o nome do campo de upload e 10 é o número máximo de arquivos
//TODO - arrumar multi Upload
//TODO - limitar o tamanho mb de imgs
//TODO - converter todas para png ao salvar
//TODO - apenas fazer upload de imgs [.png, .jpg, .jpeg, etc]
//TODO - strip meta-dados
//TODO - verificar arquivos maliciosos na img
//TODO - arrumar infos NO DB, adicionar usuario Upload, sfw/nsfw, ativo/desativ/lixeira
//TODO - campo de tags editaveis

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

        //TO:DO
        //Mudar isso par ao final caso a IMG for unica abrir rota para confirmar Upload
        //passando nome e tags
        const { title, description } = req.body;
        //FIM TO:DO

        const images = req.files.map(file => file);
        const filenames = images.map(image => image.filename);
        //console.log(filenames);

        // Caminho para a pasta de destino, 
        //primeiro vai para destinationPathTemp e se der certo vai para 
        //destinationPathImg onde guarda e insert no DB com ela
        const destinationPathTemp = path.join(__dirname, '..', '..', 'imgs', 'temp');
        const destinationPathImg = path.join(__dirname, '..', '..', 'imgs');

        for (const image of images) {
            // Constrói o novo caminho das imagems
            const newPath = path.join(destinationPathImg, filenames[0]);
            const imgTemp = path.join(destinationPathTemp, filenames[0]);

            //Caminho do arquivo .PY
            //.PY checa se existe um img que esta sendo feito Upload: args
            //guarda em temp primeiro atraves do MUTER e verifica
            //se ja existe uma img igual ou parecida em /img
            //const pythonScriptPath = 'C:\\Users\\Fernando\\Desktop\\python\\pythonNova.py';
            const pythonScriptPath2 = path.join(__dirname, '..', '..', 'python', 'pythonNovaLimpa.py');
            

            // Executa o script Python passando o argumento imgTemp
            // Se imgTemp ja existir na psta /img ele vai para a rota /igual
            /*TODO
            arrumar rota : igual
            arrumar rota : parecida
            arrumar rota : original para mandar tags
            */
            const { exec } = require('child_process');
            exec(`python "${pythonScriptPath2}" "${imgTemp}"`, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erro ao executar o comando: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`Erro de execução: ${stderr}`);
                    return;
                }
                //Log do resultado do .PY img;jpg igual / parecida
                console.log(stdout.trim())

                //Se saida do .PY for === a igual
                if (stdout.includes('igual')) {
                    const imgDuplicada = filenames[0]
                    const imgigual = stdout.trim().split(' ')[0];
                    console.log(`Imagem ja existe ${imgigual}`)
                    console.log(`Imagem Nova duplicada ${imgDuplicada}`)
                    // Redireciona para a rota /igual
                    res.status(200).render('igual', { imgDuplicada: imgDuplicada , imgigual : imgigual });
                } else {
                    fs.copyFileSync(image.path, newPath);
                    // Insere informações sobre a imagem no banco de dados
                    await connection.query('INSERT INTO images (title, description, path) VALUES (?, ?, ?)', [title, description, filenames]);
                    // Continua para a rota principal
                    res.send('<script>alert("Imagens enviadas com sucesso!"); window.location.href = "/upload";</script>');
                }

            });
        }
        
    });
});

router.get('/igual', (req, res) => {
    const error = req.query.error;
    res.render('igual', { error });
});


module.exports = router;