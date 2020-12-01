const nodeMailer = require('nodemailer');

var transporter;

module.exports = {
    startMailer: startMailer,
    send: send,
    sendRegisterEmail: sendRegisterEmail,
    sendNotificationEmail: sendNotificationEmail
};

function startMailer() {
    transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAILER_EMAIL,
            pass: process.env.MAILER_PASS
        },
    });
    transporter.verify(function(err, success) {
        if (err) { console.log(err); }
        else { console.log("Mailer started with Gmail integration"); }
    });
}

function send(message, row) {
    return new Promise((resolve, reject) => {
        if (transporter) {
            transporter.sendMail(message, function(err, info) {
                if (err !== null) { return reject(err); }
                console.log(`Email sent to ${message.to}: ${info.response}`); 
                return resolve(row);
            });
        } else {
            return reject("Email transporter hasn't started");
        }
    })
}

function sendRegisterEmail(row) {
    return new Promise((resolve, reject) => {
        let link = `https://duohando.com/verify?evs=${row.emailverify_secret}`;
        let message = {
            to: row.email,
            subject: "Please Confirm Your Duohando Email Account",
            html: `Hello ${row.fname},<br>Please Click on the link to verify your email: <a href="${link}">Verify My Email</a>`
        }
        send(message, row)
            .then(function(row) { return resolve(); })
            .catch(function(err) {
                return reject(err);
            });
    });
}

function sendNotificationEmail(email, row, type) {
    return new Promise((resolve, reject) => {
        let message;
        switch (type) {
            case "password-change":
                let link1 = `https://duohando.com/verify?pds=${row.disable_secret}`;
                message = {
                    to: email,
                    subject: "Duohando password change",
                    html: `Hello ${row.fname},<br>Your password has been changed!<br>If this was not you, click the link to disable your account: <a href="${link1}">Disable account</a><br>This link expires in 1 hour.`
                }
                break;
            case "email-change":
                let link2 = `https://duohando.com/verify?eds=${row.disable_secret}`;
                message = {
                    to: email,
                    subject: "Duohando email change",
                    html: `Hello ${row.fname},<br>Your email has been changed!<br>If this was not you, click the link to disable your account: <a href="${link2}">Disable account</a><br>This link expires in 1 hour.`
                }
                break;
            case "forgot-password":
                let link3 = `https://duohando.com/verify?pcs=${row.passwordchange_secret}`;
                message = {
                    to: email,
                    subject: "Duohando Password Change Link",
                    html: `Hello ${row.fname},<br>Click the link to change your password: ${link3}<br>If you did not request this link, then you may want to change your email address on your dashboard.<br>This link expires in 1 hour.`
                }
                break;
            case "forgot-email":
                message = {
                    to: email,
                    subject: "Duohando Email Reminder",
                    html: `Hello ${row.fname},<br>Looks like you forgot your email!<br>Now you know what it is!<br>If you did not request this reminder then you may want to secure your account by changing your email and/or password on your dashboard.`
                }
                break;
        }
        if (message) {
            send(message, row)
            .then(function(row) { return resolve(); })
            .catch(function(err) {
                return reject(err);
            });
        } else { return reject("Notification email type was never defined"); }
    });
}