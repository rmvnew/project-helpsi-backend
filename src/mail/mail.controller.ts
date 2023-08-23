import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { MailService } from './mail.service';

@Controller('mail')
@ApiBearerAuth()

export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  sendMail() {
    return this.mailService.sendMail();
  }


}
