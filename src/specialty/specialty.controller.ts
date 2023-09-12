import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { SpecialtyService } from './specialty.service';

@Controller('specialty')
@ApiTags('Specialty')
@ApiBearerAuth()


export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({
    description: `# Esta rota adiciona uma nova especialização.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })

  @ApiBody({
    description: '## Schema padrão para criar a especialização.',
    type: CreateSpecialtyDto
  })
  async create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtyService.create(createSpecialtyDto);
  }

  @Post('/list')
  @ApiExcludeEndpoint()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async saveAll(@Body() list: string[]) {

    this.specialtyService.saveAll(list)
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({
    description: `# Esta rota busca todas as especializações do psicólogo.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })
  async findAll() {
    return this.specialtyService.findAll();
  }


  @Get('/check-view')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiExcludeEndpoint()
  async checkView() {
    return this.specialtyService.checkView();
  }

  @Get('/availables')
  @PublicRoute()
  @ApiOperation({
    description: `# Esta rota busca todas as especializações disponiveis.
    Tipo: Livre. 
    Acesso: [Todos]` })
  async availables() {
    return this.specialtyService.getAvailableSpacialties();
  }

  @Get('/psychologist-by-specialty')
  @PublicRoute()
  @ApiOperation({
    description: `# Esta rota busca todos psicólogos de acordo com a especialização.
    Tipo: Livre. 
    Acesso: [Todos]` })
  @ApiQuery({ name: 'specialty', required: true, description: '### Nome da especialização do Psicólogo!' })
  async psychologistBySpecialty(
    @Query('specialty') specialty: string
  ) {
    return this.specialtyService.getPsychologistBySpecialty(specialty)
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({
    description: `# Esta rota busca uma especialização por Id.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })
  @ApiParam({ name: 'id', required: true, description: '### Id da especialização' })
  async findOne(@Param('id') id: string) {
    return this.specialtyService.findOne(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({
    description: `# Esta rota atualiza uma especialização por Id.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })
  @ApiParam({ name: 'id', required: true, description: '### Id da especialização' })
  async update(@Param('id') id: string, @Body() updateSpecialtyDto: UpdateSpecialtyDto) {
    return this.specialtyService.update(id, updateSpecialtyDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({
    description: `# Esta rota deleta uma especialização por Id.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })
  @ApiParam({ name: 'id', required: true, description: '### Id da especialização' })
  async remove(@Param('id') id: string) {
    return this.specialtyService.remove(id);
  }

}
