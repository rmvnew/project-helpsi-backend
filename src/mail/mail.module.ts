import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { transporter } from './transporter.config';

@Module({
  controllers: [MailController],
  providers: [MailService,
    {
      provide: 'MAIL_TRANSPORTER',
      useValue: transporter,
    },]
})
export class MailModule { }
