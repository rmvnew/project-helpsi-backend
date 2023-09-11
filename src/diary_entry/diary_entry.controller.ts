import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { getDiaryEntry } from 'src/common/routes.path';
import { DiaryEntryService } from './diary_entry.service';
import { CreateDiaryEntryDto } from './dto/create-diary_entry.dto';
import { DiaryFilter } from './dto/diary.filter';
import { UpdateDiaryEntryDto } from './dto/update-diary_entry.dto';

@Controller('diary-entry')
@ApiTags('DiaryEntry')
@ApiBearerAuth()


export class DiaryEntryController {
  constructor(private readonly diaryEntryService: DiaryEntryService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PATIENT))
  @ApiOperation({
    description: `# Esta rota adiciona um novo diário.
    Tipo: Autenticada. 
    Acesso: [Administrador,Paciente]` })
  @ApiBody({
    description: '## Schema padrão para criar um diário.',
    type: CreateDiaryEntryDto
  })
  create(@Body() createDiaryEntryDto: CreateDiaryEntryDto) {
    return this.diaryEntryService.create(createDiaryEntryDto);
  }

  @Get()
  @ApiOperation({
    description: `# Esta rota busca uma lista de diários.
    Tipo: Autenticada. 
    Acesso: [Administrador,Paciente,Psicólogo]` })
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PATIENT_PSYCHOLOGIST))
  async findAll(
    @Query('filter') filter: DiaryFilter
  ) {

    filter.route = getDiaryEntry()

    return this.diaryEntryService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({
    description: `# Esta rota busca um registro de diário por Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Paciente,Psicólogo]` })
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PATIENT_PSYCHOLOGIST))
  @ApiParam({ name: 'id', description: '### Id do diário' })
  async findOne(@Param('id') id: string) {
    return this.diaryEntryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    description: `# Esta rota atualiza um registro de diário por Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Paciente]` })
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PATIENT))
  @ApiParam({ name: 'id', description: '### Id do diário' })
  async update(@Param('id') id: string, @Body() updateDiaryEntryDto: UpdateDiaryEntryDto) {
    return this.diaryEntryService.update(id, updateDiaryEntryDto);
  }

  @Delete(':id')
  @ApiOperation({
    description: `# Esta rota atualiza um registro de diário por Id.
    Tipo: Autenticada. 
    Acesso: [Administrador,Paciente]` })
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PATIENT))
  @ApiParam({ name: 'id', description: '### Id do diário' })
  remove(@Param('id') id: string) {
    return this.diaryEntryService.remove(id);
  }
}
