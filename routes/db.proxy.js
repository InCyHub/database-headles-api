const mysql = require('mysql2');
var express = require('express');
var router = express.Router();
const connections = require('./../src/connections.js');

const mysqlPool = (host, user, password, database) => {
    return mysql.createPool({
        host: host,
        user: user,
        password: password,
        database: database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

const findDBConnection = async (pConnName) => {
    vDbConnHandler = await connections.database.find((item) => {
        if (item.connName == pConnName) {
            return item;
        }
    });
    let conn = mysqlPool(vDbConnHandler.host, vDbConnHandler.user, vDbConnHandler.password, vDbConnHandler.database);
    if (typeof (conn) !== undefined) {
        return conn;
    } else {
        return false;
    }
};

/* GET database.table records */
router.get('/:database/:table/:whereconditionfields/:whereconditionvalues', function (req, res, next) {
    var vDatabase = req.params.database;
    var vTable = req.params.table;
    var vWhereConditionFields = req.params.whereconditionfields.replace('','') || '';
    var vWhereConditionValues = req.params.whereconditionvalues.replace(/'/g,'') || '';
    var vParams = [vTable];
    var vSql = "";
    var vWhereConditionFieldsArr = vWhereConditionFields.split(',');
    var vWhereConditionValuesArr = vWhereConditionValues.split(',');
    if(vWhereConditionFieldsArr.length > 0 && vWhereConditionValuesArr.length > 0){
        var flds = "";
        for (let index = 0; index < vWhereConditionFieldsArr.length; index++) {
            const element = vWhereConditionFieldsArr[index];
            flds += "`" + element + "`=? AND";
            vParams.push(mysql.escape(vWhereConditionValuesArr[index]).replace(/'/g,''));
        }
        flds = flds.substring(0, Math.round(flds.length - 3));
        vSql = "SELECT t.* FROM ?? t WHERE " + flds;
    }else{
        vSql = "SELECT t.* FROM ?? t";
    }
    
    findDBConnection(vDatabase).then((vDbConnHandler) => {
        if (vDbConnHandler) {
            console.group([vParams, vDatabase, vSql]);
            vDbConnHandler.query(vSql, vParams, (error, rows) => {
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
        }else{
            res.status(500).json({
                status: false,
                result: `Database connection with name ${vDatabase} not found.`
            });
        }
    });
});

/* INSERT database.table records */
router.post('/:database/:table', async function (req, res, next) {
    connection.query('SHOW COLUMNS FROM `??`', [req.params.table], (error, rows, fields) => {
        console.log(rows);
        res.json({
            rows: rows,
            fields: fields
        });
    });
});

/* INSERT database.table records */
router.put('/:database/:table', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

/* INSERT database.table records */
router.patch('/:database/:table', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

/* INSERT database.table records */
router.delete('/:database/:table', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

module.exports = router;