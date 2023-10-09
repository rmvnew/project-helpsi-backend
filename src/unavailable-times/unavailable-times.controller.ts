import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { getUnavailablePath } from 'src/common/routes.path';
import { CreateUnavailableTimeDto } from './dto/create-unavailable-time.dto';
import { UnavailableFilter } from './dto/unavailable.filter';
import { UpdateUnavailableTimeDto } from './dto/update-unavailable-time.dto';
import { UnavailableTimesService } from './unavailable-times.service';

@Controller('unavailable-times')
@ApiTags('UnavailableTime')
@ApiBearerAuth()


export class UnavailableTimesController {
  constructor(private readonly unavailableTimesService: UnavailableTimesService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota adiciona uma data de indisponibilidade.
    Tipo: Autenticada. 
    Acesso: [Todos]` })

  @ApiBody({
    description: '## Schema padrão para criar o evento.',
    type: CreateUnavailableTimeDto
  })
  async create(@Body() createUnavailableTimeDto: CreateUnavailableTimeDto) {
    return this.unavailableTimesService.create(createUnavailableTimeDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota busca todas datas indisponíveis para agendamento!.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  async findAll(@Query() filter: UnavailableFilter) {

    filter.route = getUnavailablePath();

    return this.unavailableTimesService.findAll(filter);
  }


  @Get('findAllDatesWithinRanges')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota busca todas datas indisponíveis para agendamento!.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  async findAllDatesWithinRanges(
    @Query('psychologistId') psychologistId: string
  ) {
    const result = await this.unavailableTimesService.findAllDatesWithinRanges(psychologistId);
    if (!result.length) {
      throw new NotFoundException('Nenhum período indisponível encontrado.');
    }
    return result;
  }



  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota busca data indisponíveil por Id!.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: '### Id do evento' })
  async findOne(@Param('id') id: string) {
    return this.unavailableTimesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota atualiza um evento para marcar datas indisponíveis por Id!.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: '### Id do evento' })
  async update(@Param('id') id: string, @Body() updateUnavailableTimeDto: UpdateUnavailableTimeDto) {
    return this.unavailableTimesService.update(id, updateUnavailableTimeDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota deleta um evento para marcar datas indisponíveis por Id!.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: '### Id do evento' })
  async remove(@Param('id') id: string) {
    return this.unavailableTimesService.remove(id);
  }






}
