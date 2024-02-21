const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'teste'
});

db.connect((err) => {
  if (err) {
    throw err;
  }else{
    console.log("Conectado!")
  }
});

module.exports = db;
