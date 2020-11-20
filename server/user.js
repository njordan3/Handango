const bcrypt = require('bcrypt');

var connection;

module.exports = {
    initDB: initDB,
    connectToDB: connectToDB,
    findUser: findUser,
    Register: Register,
    validEmail: validEmail,
    validPhoneNumber: validPhoneNumber,
    validPassword: validPassword,
    comparePassword: comparePassword,
    hashPassword: hashPassword,
    changeEmail: changeEmail,
    changePassword: changePassword,
    changePhoneNumber: changePhoneNumber,
    changeLoginType: changeLoginType
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

function changePhoneNumber(email, phone_num_new) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                connection.query('CALL changePhoneNumber(?,?)', [email, phone_num_new], function(err, result) {
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
            else if (params.length !== 8) return reject(new Error(`Wrong amount of parameters when changing login type: ${params.length}`));
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

function findUser(email, external_id = null) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                connection.query('CALL findUserProc(?,?)', [email, external_id], function(err, result) {
                    if (err) return reject(err.sqlMessage);
                    if (result[0].length === 0) return reject(new Error(`Account ${email} attempted invalid login type`));
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
                    if (result[0].length === 0) return reject(new Error(`Account ${params[2]} attempted invalid login type`));
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

function validPhoneNumber(phone_num) {
    let phoneNumberREGEX = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
    return new Promise((resolve, reject) => {
        if (!phoneNumberREGEX.test(phone_num)) {
            return reject(new Error("Improperly formatted phone number"));
        }
        return resolve();
    });
}

function comparePassword(email, attempts, password, hash) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) return reject(err);
            else {
                bcrypt.compare(password, hash, function(err, result) {
                    if (err) return reject(err);
                    else if (!result) {
                        connection.query('CALL setLoginAttempt(?,?)', [email, attempts+1], function(err, result) {
                            if (err) return reject(err.sqlMessage);
                        });
                        return reject(new Error("Wrong password"));
                    } else {
                        connection.query('CALL setLoginAttempt(?,?)', [email, 0], function(err, result) {
                            if (err) return reject(err.sqlMessage);
                        });
                        return resolve();
                    }
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
