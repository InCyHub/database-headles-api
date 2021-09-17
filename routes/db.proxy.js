const mysql = require('mysql2');
var express = require('express');
var router = express.Router();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345679',
    database: 'vgparts_db'
});

/* GET database.table records */
router.get('/:database/:table', function (req, res, next) {
    var vDatabase = req.params.database;
    var vTable = req.params.table.replace("'", "");
    let sql = "SELECT t.* FROM ??.?? t";
    let params = [vDatabase, vTable];
    console.group([vDatabase, vDatabase, sql]);
    connection.query(sql, params, (error, rows) => {
        if (error) {
            res.status(500).json({
                status: false,
                result: error
            });
        } else {
            res.status(200).json({
                status: true,
                result: rows
            });
        }
    });
});

/* INSERT database.table records */
router.post('/:database/:table', async function (req, res, next) {
    connection.query('SHOW COLUMNS FROM `??`', [req.params.table], (error, rows, fields) => {
        console.log(rows);
        res.json({ rows: rows, fields: fields });
    });
});

/* INSERT database.table records */
router.put('/:database/:table', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

/* INSERT database.table records */
router.patch('/:database/:table', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

/* INSERT database.table records */
router.delete('/:database/:table', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;


