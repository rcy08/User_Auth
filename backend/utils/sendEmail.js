const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const refresh_token = process.env.REFRESH_TOKEN;
const redirect_uri = process.env.REDIRECT_URI;

const oauth2client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
oauth2client.setCredentials({ refresh_token });

const sendEmail = async (options) => {
    const accessToken = await oauth2client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USERNAME,
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: refresh_token,
            accessToken: accessToken,
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