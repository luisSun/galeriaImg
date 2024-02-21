const mysql = require('mysql2/promise');

// Configuração da conexão com o banco de dados
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'teste'
});


module.exports = connection;
