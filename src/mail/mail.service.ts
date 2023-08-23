import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {

  constructor(@Inject('MAIL_TRANSPORTER') private readonly transporter: Transporter) { }
  sendMail() {
    const mailOptions = {
      to: 'rmvnew@gmail.com',
      from: 'helpsimanaus@outlook.com',
      subject: 'This is a test email',
      body: 'This is the body of the email.',
    };

    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }
}
