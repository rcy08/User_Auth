const nodemailer = require('nodemailer');

const sendEmail = (options) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(info);
        }
    });
}

module.exports = sendEmail; 