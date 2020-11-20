const nodeMailer = require('nodemailer');

var transporter;

module.exports = {
    startMailer: startMailer,
    sendMail: sendMail
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
        if (err) console.log(err);
        else console.log("Mailer started with Gmail integration");
    });
}

function sendMail(message) {
    if (transporter) {
        transporter.sendMail(message, function(err, info) {
            if (err) console.log(err);
            else console.log(`Email sent to ${message.to}: ${info.response}`);
        });
    }
}