const nodemailer = require('nodemailer');

const sendEmail = async(to,subject, text) =>{
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'opanand685@gmail.com',
            pass: 'vbni cffo jocc erco',
        },
    });

    const mailOptions = {
    from: 'opanand685@gmail.com',
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = { sendEmail };

