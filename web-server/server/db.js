const bcrypt = require('bcrypt');
const randomString = require('crypto-random-string');

var connection;

module.exports = {
    initDB: initDB,
    connectToDB: connectToDB,
    findUser: findUser,
    Register: Register,
    comparePassword: comparePassword,
    add2FA: add2FA,
    changeEmail: changeEmail,
    changePassword: changePassword,
    changeLoginType: changeLoginType,
    Login: Login,
    verifyEmail: verifyEmail,
    verifyDisableSecret: verifyDisableSecret,
    verifyPasswordSecret: verifyPasswordSecret,
    addPasswordSecret: addPasswordSecret,
    getEmailFromUsername: getEmailFromUsername,
    setLectureProgress: setLectureProgress,
    setPracticeProgress: setPracticeProgress,
    setPracticeComplete: setPracticeComplete,
    setQuizComplete: setQuizComplete
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
        if (err) { console.log('MySQL server is offline'); }
        else { console.log('Connected to the MySQL server.'); }
    });
}

function connectToDB() {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
           if (err) { return reject('MySQL server is offline'); }
           return resolve();
        });
    });
}

function add2FA(params) {
    //permanently store the now verified secret on the database
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL add2FA(?,?,?)', params, function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    return resolve();
                });
            }
        });
    });     
}

function changeEmail(email, email_new) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else if (email === email_new) { return reject("You cannot change to your current email..."); }
            else {
                connection.query('CALL changeEmail(?,?,?,?)', [email, email_new, randomString({length: 128, type: 'url-safe'}), randomString({length: 128, type: 'url-safe'})], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) { return resolve(result[0][0]); }
                    else { return reject(`There was an issue changing your email...`); }
                });
            }
        });
    })
}

function changePassword(email, password_new) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL changePassword(?,?,?)', [email, password_new, randomString({length: 128, type: 'url-safe'})], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) { return resolve(result[0][0]); }
                    else { return reject(`There was an issue changing your password...`); }
                });
            }
        });
    })
}

function changeLoginType(params) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL changeLoginType(?,?,?,?,?,?,?,?,?,?)', params, function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result instanceof Array) { return resolve(result[0][0]); }
                    else { return reject('There was an issue changing your login type...'); }
                });
            }
        });
    })
}

function findUser(email, external_id, registering = true) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL findUserProc(?,?)', [email, external_id], function(err, result) {
                    if (registering && external_id === null) {  //register with email/passord account
                        if (err) { return resolve(); }
                        if (result[0].length !== 0) { return reject(`Can't register for an already existing account`); }
                        else { return reject(`You attempted an invalid login method for your account...`); }
                    } else if (registering && external_id !== null) {
                        if (err) { return resolve(err); }   //login and register with external account
                        if (result[0].length !== 0) { return resolve(result[0][0]); }
                        else { return reject(`You attempted an invalid login method for your account...`); }
                    } else {    //general login
                        if (err) { return reject(err.sqlMessage); } //user doesnt exist
                        if (result[0].length !== 0) {
                            let row = result[0][0];
                            if (row.disabled == 1) { incrementLoginAttempt(email); return reject(`Your account is disabled...`); }
                            else if (row.verified == 0) { incrementLoginAttempt(email); return reject(`You have not verified your email...`); }
                            else return resolve(row);
                        } else { incrementLoginAttempt(email); return reject(`You attempted an invalid login method for your account...`); }
                    }
                });
            }
        });
    });
}

function Register(params) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                console.log(`Registering ${params[2]}`);
                connection.query('CALL Register(?,?,?,?,?,?,?,?,?)', params, function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result instanceof Array) { return resolve(result[0][0]); }
                    else { return reject(`You attempted an invalid login method for your account...`); }
                });
            }
        });
    });
}

function incrementLoginAttempt(email) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL incrementLoginAttempt(?)', [email], function(err, result) {
                    if (err) { return reject(err.sqlMessage);} 
                });
                return resolve();
            }
        });
    });
}

function Login(row) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL Login(?,?)', [row.email, row.external_id], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    return resolve(row);
                });
            }
        });
    });
}

function verifyEmail(secret) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL verifyEmailSecret(?)', [secret], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) {
                        if (result[0][0].verified == 1) { return resolve(); }
                        else { return reject(`There was a problem verifying your email...`); }
                    } else { return reject(`The verification token could not be found for you email...`); }
                });
            }
        });
    });
}

function verifyDisableSecret(secret, type) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL verifyDisableSecret(?,?)', [secret, type], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) {
                        if (result[0][0].disabled == 1) { return resolve(); }
                        else { return reject(`There was a problem verifying the token to disable your account...`); }
                    } else { return reject(`The verification token could not be found to disable your account...`); }
                });
            }
        });
    });
}

function verifyPasswordSecret(secret) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL verifyPasswordSecret(?)', [secret], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) { return resolve(result[0][0]); }
                    else { return reject(`The verification token could not be found to verify your password...`); }
                });
            }
        });
    });
}

function addPasswordSecret(row) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL addPasswordSecret(?,?,?)', [row.email, row.external_id, randomString({length: 128, type: 'url-safe'})], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) { 
                        if (result[0][0].passwordchange_secret !== null) { return resolve(result[0][0]); }
                        else { return reject(`There was a problem setting the verification token for your password...`); }
                    }
                    else { return reject(`The verification token could not be set for your password...`); }
                });
            }
        });
    });
}

function getEmailFromUsername(username) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL getEmailFromUsername(?)', [username], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) { return resolve(result[0][0]); }
                    else { return reject(`There is not an email tied to ${username}`); }
                });
            }
        });
    });
}

function comparePassword(email, password, row) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                bcrypt.compare(password, row.password_hash, function(err, result) {
                    if (err) { return reject(err); }
                    else if (!result) {
                        connection.query('CALL setLoginAttempt(?,?)', [email, row.login_attempts+1], function(err, result) {
                            if (err) { return reject(err.sqlMessage); }
                        });
                        return reject(`Wrong password...`);
                    }
                    return resolve(row);
                });
            }
        })
    });   
}

function setLectureProgress(email, id, progress, lesson) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL setLectureProgress(?,?,?,?)', [email, id, progress, lesson], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) { return resolve(result[0][0]); }
                    else { return reject(`There was a problem setting lecture progress for lesson ${lesson}`); }
                });
            }
        });
    });
}

function setPracticeProgress(email, id, progress, lesson) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL setPracticeProgress(?,?,?,?)', [email, id, progress, lesson], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) { return resolve(result[0][0]); }
                    else { return reject(`There was a problem setting practice progress for lesson ${lesson}`); }
                });
            }
        });
    });
}

function setPracticeComplete(email, id, lesson) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL setPracticeComplete(?,?,?)', [email, id, lesson], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) { return resolve(result[0][0]); }
                    else { return reject(`There was a problem setting practice complete for lesson ${lesson}`); }
                });
            }
        });
    });
}

function setQuizComplete(email, id, lesson) {
    return new Promise((resolve, reject) => {
        connection.connect(function(err) {
            if (err) { return reject(err); }
            else {
                connection.query('CALL setQuizComplete(?,?,?)', [email, id, lesson], function(err, result) {
                    if (err) { return reject(err.sqlMessage); }
                    if (result[0].length !== 0) { return resolve(result[0][0]); }
                    else { return reject(`There was a problem setting quiz complete for lesson ${lesson}`); }
                });
            }
        });
    });
}