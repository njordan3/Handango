var connection;

function initDB() {
    var mysql = require('mysql2');

    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    connection.connect(function(err) {
        if (err) {
            console.error('error: ' + err.message);
        } else {
            console.log('Connected to the MySQL server.');
        }
    });
}

function connectToDB(callback) {
    connection.connect(function(err) {
        callback(err);
    });
}

function findUser(email, callback) {
    connection.connect(function(err) {
        if (err) {
            callback(err, null);    //dont query is db isnt up
        } else {
            connection.query('CALL findUser(?)', [email], function(err, result) {
                callback(err, JSON.parse(JSON.stringify(result[0][0])));
            });
        }
    });

}

function addUser(params, callback) {
    connection.connect(function(err) {
        if (err) {
            callback(err, null);    //dont query is db isnt up
        } else if (params.length !== 7) {
            callback(`addUser called with wrong amount of params: ${params.length}`, null);
        } else {
            connection.query('CALL addUser(?,?,?,?,?,?,?)', params, function(err, result) {
                callback(err, result);
            });
        }
    });
}

module.exports = {
    initDB: initDB,
    connectToDB: connectToDB,
    findUser: findUser,
    addUser: addUser,
}