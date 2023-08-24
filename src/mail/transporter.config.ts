import * as nodemailer from 'nodemailer';

// Logs para verificar as variáveis de ambiente
console.log('User:', process.env.MAIL_USER);
console.log('Password:', process.env.MAIL_PASSWORD);

export const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});
