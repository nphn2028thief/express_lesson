import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hoainhan2082000',
  database: 'express',
});

export default db;
