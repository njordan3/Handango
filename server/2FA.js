const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

module.exports = {
    set2FAInfo: set2FAInfo,
    unset2FAInfo: unset2FAInfo,
    check2FA: check2FA,
    activate2FA: activate2FA
}

function activate2FA(req) {
    //temporarily store a secret in the user's session
    return new Promise((resolve, reject) => {
        if (req.session.passport.user.two_factored) return reject(`${req.session.passport.user.username} already enabled 2FA`);
        else {
            var secret = speakeasy.generateSecret({length: 20});
            return QRCode.toDataURL(secret.otpauth_url)
                .then(function(url) {
                    req.session.passport.user.ejs = {};
                    req.session.passport.user.ejs.qrcode = url;
                    req.session.passport.user.ejs.token = secret.base32;
                    req.session.save();
                    return resolve();
                })
                .catch(function(err) {
                    return reject(err);
                });
        }
    });
}

function check2FA(req, res) {
    return new Promise((resolve, reject) => {
        //debug
        let t = speakeasy.totp({
            secret: req.session.passport.user.secret,
            encoding: 'base32'
        });
        console.log(t, req.body.token);

        console.log(req.session.passport.user.secret);

        let result = speakeasy.totp.verify({
            secret: req.session.passport.user.secret,
            encoding: 'base32',
            token: req.body.token
        });
    
        if (result) {
            req.session.passport.user.logged_in = true;
            req.session.passport.user.two_factored = true;
            req.session.save();
            return resolve();
        } else {
            return reject(`${req.session.passport.user.username} failed 2FA check`);
        }
    });
}

function set2FAInfo(req, res, action, fail, success) {
    if (req.session.passport.user.two_factored) {
        req.session.passport.user.ejs.toggle2FAForm = true;
        req.session.passport.user.ejs.action = action;
        req.session.passport.user.ejs.failRedirect = fail;
        req.session.passport.user.ejs.successRedirect = success;
        req.session.save();
        if (res) {
            res.redirect(fail);
        }
        return true;
    }
    return false;
}

function unset2FAInfo(req) {
    req.session.passport.user.ejs.toggle2FAForm = false;
    req.session.passport.user.ejs.action = undefined;
    req.session.passport.user.ejs.failRedirect = undefined;
    req.session.passport.user.ejs.successRedirect = undefined;
    req.session.save();
}