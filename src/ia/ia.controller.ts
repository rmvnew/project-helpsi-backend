import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CreateIaDto } from './dto/create-ia.dto';
import { IaService } from './ia.service';

@Controller('ia')
@ApiTags('IA')
@ApiBearerAuth()


export class IaController {
  constructor(private readonly iaService: IaService) { }

  @Post()
  create(@Body() createIaDto: CreateIaDto) {
    return this.iaService.create(createIaDto);
  }

  @Post('/min')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  verify() {
    this.iaService.minerarDados()
  }

}
