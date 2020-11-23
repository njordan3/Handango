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
    hashPassword: hashPassword,
    add2FA: add2FA,
    changeEmail: changeEmail,
    changePassword: changePassword,
    changeLoginType: changeLoginType,
    Login: Login,
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
            console.log('MySQL server is offline');
        } else {
            console.log('Connected to the MySQL server.');
        }
    });
}

function connectToDB() {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
           if (err) reject('MySQL server is offline');
           resolve();
        });
    });
}

function add2FA(params) {
    //permanently store the now verified secret on the database
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                connection.query('CALL add2FA(?,?,?)', params, function(err, result) {
                    if (err) return reject(err.sqlMessage);
                    return resolve();
                });
            }
        });
    });     
}

function changeEmail(email, email_new) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                connection.query('CALL changeEmail(?,?)', [email, email_new], function(err, result) {
                    if (err) return reject(err.sqlMessage);
                    return resolve();
                });
            }
        });
    })
}

function changePassword(email, password_new) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                connection.query('CALL changePassword(?,?)', [email, password_new], function(err, result) {
                    if (err) return reject(err.sqlMessage);
                    return resolve();
                });
            }
        });
    })
}

function changeLoginType(params) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else if (params.length !== 8) return reject(`Wrong amount of parameters when changing login type: ${params.length}`);
            else {
                connection.query('CALL changeLoginType(?,?,?,?,?,?,?,?)', params, function(err, result) {
                    if (err) return reject(err.sqlMessage);
                    try {
                        let row = JSON.parse(JSON.stringify(result[0][0]));
                        return resolve(row);
                    } catch (error) {
                        return reject(error);
                    }
                });
            }
        });
    })
}

function findUser(email, external_id, registering = true) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                connection.query('CALL findUserProc(?,?)', [email, external_id], function(err, result) {
                    if (err && registering) { return resolve(err);}
                    else if (err) { return reject(err.sqlMessage); }
                    if (result instanceof Array) {
                        return resolve(result[0][0]);
                    } else {
                        incrementLoginAttempt(email);
                        return reject(`Account ${email} attempted invalid login type`);
                    }
                });
            }
        });
    });
}

function Register(params) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else if (params.length !== 7) return reject(`Wrong amount of parameters when adding user: ${params.length}`);
            else {
                console.log(`Registering ${params[2]}`);
                connection.query('CALL Register(?,?,?,?,?,?,?)', params, function(err, result) {
                    if (err) return reject(err.sqlMessage);
                    if (result instanceof Array) {
                        return resolve(result[0][0]);
                    } else {
                        return reject(`Account ${params[2]} attempted invalid login type`);
                    }
                });
            }
        });
    });
}

function validEmail(email) {
    let emailREGEX = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return new Promise((resolve, reject) => {
        if (!emailREGEX.test(email)) {
            return reject("Improperly formatted email");
        }
        return resolve();
    });
}

function validPassword(password) {
    let passwordREGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-+_!@#$%^&*.,?]).{8,}/;
    return new Promise((resolve, reject) => {
        if (!passwordREGEX.test(password)) {
            return reject("Improperly formatted password");
        }
        return resolve();
    });
}

function incrementLoginAttempt(email) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                connection.query('CALL incrementLoginAttempt(?)', [email], function(err, result) {
                    if (err) return reject(err.sqlMessage);
                });
                return resolve();
            }
        });
    });
}

function Login(row) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                connection.query('CALL Login(?,?)', [row.email, row.external_id], function(err, result) {
                    if (err) return reject(err.sqlMessage);
                    return resolve(row);
                });
            }
        });
    });
}


function comparePassword(email, password, row) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                bcrypt.compare(password, row.password_hash, function(err, result) {
                    if (err) return reject(err);
                    else if (!result) {
                        connection.query('CALL setLoginAttempt(?,?)', [email, row.login_attempts+1], function(err, result) {
                            if (err) return reject(err.sqlMessage);
                        });
                        return reject(`Wrong password for ${email}`);
                    }
                    return resolve(row);
                });
            }
        })
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