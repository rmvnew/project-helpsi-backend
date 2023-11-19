import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { CodeRecoverInterface, GeneralMailInterface, SendCurrentMailInterface, WellcomeInterface } from 'src/common/interfaces/email.interface';

@Injectable()
export class MailService {

  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: 'helpsimanaus@outlook.com',
        pass: 'h3lp$1Manaus',
      },
    });


  }

  sendMail(codeRecover: CodeRecoverInterface) {


    const mailOptions: SendCurrentMailInterface = {
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

    this.sendCurrentMail(mailOptions)

  }


  wallcomeMesage(wellcome: WellcomeInterface) {


    const mailOptions: SendCurrentMailInterface = {
      to: wellcome.email,
      from: 'HelPsi <helpsimanaus@outlook.com>',
      subject: 'Seja Bem-Vindo ao Helpsi: Sua Jornada de Bem-Estar Começa Aqui',
      html: `
      <div style="font-family: Arial, sans-serif; border: 1px solid #e0e0e0; padding: 20px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
      <!-- Inserir logo aqui -->
      <img src="https://github.com/rmvnew/rmvnew/blob/main/logo_oficial_2.png?raw=true" alt="Logo da Helpsi" style="display: block; margin: auto; width: 250px; height: 130px;">
      
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

    this.sendCurrentMail(mailOptions)

  }



  async generalMail(general_mail: GeneralMailInterface) {

    const current_mail: SendCurrentMailInterface = {
      to: general_mail.to,
      from: 'HelPsi <helpsimanaus@outlook.com>',
      subject: general_mail.subject,
      html: general_mail.html
    }

    this.sendCurrentMail(current_mail)

  }



  async sendCurrentMail(mail_options: SendCurrentMailInterface) {

    this.transporter.sendMail(mail_options, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

  }


}


