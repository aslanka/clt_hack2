    const mysql = require('mysql2');

    const db = mysql.createConnection({
        host: '44.204.66.93',
        user: 'root', 
        password: '9377Chels!0',
        database: 'clthack'
    });

    db.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL Database');
    }); 

    module.exports = db;
