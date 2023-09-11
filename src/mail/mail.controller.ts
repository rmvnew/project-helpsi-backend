import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CodeRecoverInterface } from 'src/common/interfaces/email.interface';
import { MailService } from './mail.service';

@Controller('mail')
@ApiBearerAuth()

export class MailController {
  constructor(private readonly mailService: MailService) { }

  @Post()
  @ApiExcludeEndpoint()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  sendMail(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('code') code: number,
  ) {

    const data: CodeRecoverInterface = {
      name: name,
      email: email,
      code: code
    }

    return this.mailService.sendMail(data);
  }


}
