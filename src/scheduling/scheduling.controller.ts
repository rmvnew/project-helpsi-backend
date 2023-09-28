import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { schedulingPath } from 'src/common/routes.path';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { SchedulingFilter } from './dto/scheduling.filter';
import { SchedulingService } from './scheduling.service';

@Controller('scheduling')
@ApiTags('Scheduling')
@ApiBearerAuth()


export class SchedulingController {
  constructor(private readonly schedulingService: SchedulingService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota cria novo agendamento.
    Tipo: Autenticada. 
    Acesso: [Todos]` })

  @ApiBody({
    description: '## Schema padrão para criar um agendamento.',
    type: CreateSchedulingDto
  })
  async create(@Body() createSchedulingDto: CreateSchedulingDto) {
    return await this.schedulingService.create(createSchedulingDto);
  }


  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota mostra todos horários reservados.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  async findAll(@Query() filter: SchedulingFilter) {

    filter.route = schedulingPath()


    return await this.schedulingService.findAll(filter)
  }



  @Get('availability')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota mostra horários disponíveis para esta data.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiQuery({ name: 'date', description: '### informe a data para realizar esta busca (yyyy-mm-dd)' })
  async checkAvailability(@Query('date') date: string) {
    return await this.schedulingService.checkAvailability(date);
  }

}
