import { Inject, Injectable } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { CodeRecoverInterface } from 'src/common/interfaces/email.interface';

@Injectable()
export class MailService {

  constructor(@Inject('MAIL_TRANSPORTER') private readonly transporter: Transporter) { }
  sendMail(codeRecover: CodeRecoverInterface) {
    const mailOptions = {
      to: codeRecover.email,
      from: 'HelPsi <helpsimanaus@outlook.com>',
      subject: 'Código para Redefinição de Senha!!',
      html: `
              <div style="font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
                  <h2 style="color: #333;">Redefinição de Senha</h2>
                  <p>Olá, ${codeRecover.name}!!</p>
                  <p>Você solicitou a redefinição da sua senha. Abaixo está o código para prosseguir com o processo:</p>
                  <h3 style="background-color: #e6f7ff; padding: 10px; border: 1px solid #b3e0ff; text-align: center; color: #333;">${codeRecover.code}</h3>
                  <p>Se você não solicitou essa redefinição, ignore este e-mail e, por precaução, altere sua senha.</p>
                  <p>Atenciosamente,</p>
                  <p>Equipe do HelPsi</p>
              </div>

            `

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
