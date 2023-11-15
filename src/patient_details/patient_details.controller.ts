import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CreatePatientDetailDto } from './dto/create-patient_detail.dto';
import { UpdatePatientDetailDto } from './dto/update-patient_detail.dto';
import { PatientDetailsService } from './patient_details.service';

@Controller('patient-details')
@ApiTags('PatientDetails')
@ApiBearerAuth()


export class PatientDetailsController {
  constructor(private readonly patientDetailsService: PatientDetailsService) { }

  @Post()
  @ApiExcludeEndpoint()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({
    description: `# Esta rota cria novo Detalhe de paciente.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })

  @ApiBody({
    description: '## Schema padrão para criar detalhes de paciente.',
    type: CreatePatientDetailDto
  })
  async create(@Body() createPatientDetailDto: CreatePatientDetailDto) {
    return this.patientDetailsService.create(createPatientDetailDto);
  }


  @Get(':id')
  @ApiOperation({
    description: `# Esta rota busca Detalhes de um paciente.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: '### Id do detalhe' })
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  async findOne(@Param('id') id: string) {
    return this.patientDetailsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    description: `# Esta rota atualiza os Detalhes de um paciente.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })
  @ApiParam({ name: 'id', description: '### Id do detalhe' })
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  async update(@Param('id') id: string, @Body() updatePatientDetailDto: UpdatePatientDetailDto) {
    return this.patientDetailsService.update(id, updatePatientDetailDto);
  }

  @Delete(':id')
  @ApiOperation({
    description: `# Esta rota deleta os Detalhes de um paciente.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })
  @ApiParam({ name: 'id', description: '### Id do detalhe' })
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  async remove(@Param('id') id: string) {
    return this.patientDetailsService.remove(id);
  }
}
