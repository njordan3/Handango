const bcrypt = require('bcrypt');

var connection;

module.exports = {
    initDB: initDB,
    connectToDB: connectToDB,
    findUser: findUser,
    Register: Register,
    validEmail: validEmail,
    validPassword: validPassword,
    comparePassword: comparePassword,
    hashPassword: hashPassword
}

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
            console.log(err.sqlMessage);
        } else {
            console.log('Connected to the MySQL server.');
        }
    });
}

function connectToDB() {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
           if (err) reject(err.sqlMessage);
           resolve();
        });
    });
}

function findUser(email, external_id = null) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err)
            else {
                connection.query('CALL findUserProc(?,?)', [email, external_id], function(err, result) {
                    if (err) return reject(err.sqlMessage);
                    if (result[0].length === 0) return reject(new Error(`Account for ${email} doesn't exist`));
                    let row = JSON.parse(JSON.stringify(result[0][0]));
                    return resolve(row);
                });
            }
        });
    });
}

function Register(params) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else if (params.length !== 7) return reject(new Error(`Wrong amount of parameters when adding user: ${params.length}`));
            else {
                connection.query('CALL Register(?,?,?,?,?,?,?)', params, function(err, result) {
                    if (err) return reject(err.sqlMessage);
                    let row = JSON.parse(JSON.stringify(result[0][0]));
                    return resolve(row);
                });
            }
        });
    });
}

function validEmail(email) {
    let emailREGEX = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return new Promise((resolve, reject) => {
        if (!emailREGEX.test(email)) {
            return reject(new Error("Improperly formatted email"));
        }
        return resolve();
    });
}

function validPassword(password) {
    let passwordREGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{8,}/;
    return new Promise((resolve, reject) => {
        if (!passwordREGEX.test(password)) {
            return reject(new Error("Improperly formatted password"));
        }
        return resolve();
    });
}

function comparePassword(password, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function(err, result) {
            if (err) return reject(err);
            else if (!result) return reject(new Error("Wrong password"));
            return resolve();
        });
    });   
}

function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, parseInt(process.env.USER_SALT), function(err, hash) {
            if (err) return reject(err);
            return resolve(hash);
        });
    });
}