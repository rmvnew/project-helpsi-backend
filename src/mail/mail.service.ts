import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { CodeRecoverInterface, WellcomeInterface } from 'src/common/interfaces/email.interface';

@Injectable()
export class MailService {

  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    console.log("Inicializando MailService...");
    console.log("User:", process.env.MAIL_USER);
    console.log("Pass:", process.env.MAIL_PASSWORD ? 'Password Present' : 'Password Absent');
  }

  sendMail(codeRecover: CodeRecoverInterface) {
    console.log(codeRecover);

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


  wallcomeMesage(wellcome: WellcomeInterface) {


    const mailOptions = {
      to: wellcome.email,
      from: 'HelPsi <helpsimanaus@outlook.com>',
      subject: 'Seja Bem-Vindo ao Helpsi: Sua Jornada de Bem-Estar Começa Aqui',
      html: `
      <div style="font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
      <!-- Inserir logo aqui -->
      <img src="https://github.com/rmvnew/rmvnew/blob/main/helpsi-logo.png?raw=true" alt="Logo da Helpsi" style="display: block; margin: auto; width: 130px; height: 130px;">
      
      <h2 style="color: #333;">Olá, ${wellcome.name}, seja muito bem-vindo!</h2>
      
      <p>Estamos verdadeiramente felizes por você ter escolhido a Helpsi para ser sua parceira na jornada de autoconhecimento e bem-estar emocional.</p>
      
      <p>Aqui, você encontrará um ambiente seguro, profissionais capacitados e uma comunidade dedicada a apoiá-lo em cada etapa do seu caminho.</p>
      
      <p>Se tiver qualquer dúvida ou precisar de assistência, estamos sempre aqui para ajudar. Afinal, a sua saúde mental é nossa prioridade.</p>
      
      <br>
      <p>Com carinho,</p>
      <p>Equipe do Helpsi</p>
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


