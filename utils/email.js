const nodemailer = require('nodemailer');

module.exports = async options => {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        // host: "smtp.mailtrap.io",
        // port: 587,
        // auth: {
        //     user: "861ff06ae7833c",
        //     pass: "172dda97200e01"
        // }
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        //activate in gmail 'less secure app' option
    })

    // 2) Define the email options
    const mailOptions = {
        from: 'John Doe <email@mail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html:

    }

    // 3) Send the email
    await transporter.sendMail(mailOptions);
}
