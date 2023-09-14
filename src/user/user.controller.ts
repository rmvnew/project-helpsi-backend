import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { RecoverInterface } from 'src/common/interfaces/recover.interface';
import { getUserPath } from 'src/common/routes.path';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { FilterUser } from './dto/Filter.user';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Qrcode2fa } from './dto/qrcode.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';


@Controller('user')
@ApiTags('User')
@ApiBearerAuth()

// @ApiExcludeEndpoint()

export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({
    description: `# Esta rota adiciona um novo usuário.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo, Atendente]` })

  @ApiBody({
    description: '## Schema padrão para criar usuário.',
    type: CreateUserDto
  })
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }


  @Get('/profile')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({
    description: `# Esta rota busca todos perfis.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo, Atendente]` })
  async findAllProfile(): Promise<ProfileEntity[]> {
    return this.userService.findAllProfile()
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({
    description: `# Esta rota busca todos usuários.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo, Atendente]` })
  @ApiQuery({ name: 'user_name', required: false, description: '### Este é um filtro opcional!' })
  async findAll(
    @Query() query
  ): Promise<Pagination<UserResponseDto>> {

    const filter: FilterUser = {
      ...new FilterUser(),
      ...query
    };
    filter.route = getUserPath();
    return this.userService.findAll(filter);
  }


  @Post('/resetPass')
  @PublicRoute()
  @ApiOperation({
    description: `# Esta rota redefine a senha do usuário.
    Tipo: Publica. 
    Acesso: [Livre]` })
  @ApiQuery({ name: 'code', description: '### Código especial, com duração de cinco minutos obtido através do email.' })
  @ApiQuery({ name: 'password', description: '### Nova senha. ' })
  @ApiQuery({ name: 'email', description: '### E-mail do usuário que está resetando a senha ' })
  async resetPassword(
    @Query('code') code: number,
    @Query('password') password: string,
    @Query('email') email: string,
  ) {

    const recover: RecoverInterface = {
      email: email,
      code: code,
      password: password
    }

    return this.userService.resetPassword(recover)
  }


  @Post('/recover-code')
  @PublicRoute()
  @ApiOperation({
    description: `# Esta rota dispara o email que contém o código para redefinição de senha.
    Tipo: Publica. 
    Acesso: [Livre]` })
  @ApiQuery({ name: 'email', description: '### E-mail do usuário que está resetando a senha. ' })
  async recoverCode(
    @Query('email') email: string
  ) {

    console.log('Email controller: ', email);

    return this.userService.recoverCode(email)
  }


  @Get('/userEmail')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota busca um usuário pelo email.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'email', description: '### E-mail de cadastro do usuário. ' })
  async getUserByEmail(
    @Query('email') email: string
  ) {

    return this.userService.findUserByEmail(email)
  }


  @Get('/allPsychologists')
  // @UseGuards(PermissionGuard(AccessProfile.ALL))
  @PublicRoute()
  @ApiOperation({
    description: `# Esta rota obtém a lista de todos psicólogos.
    Tipo: Publica. 
    Acesso: [Livre]` })
  async getAllPsychologists() {

    return this.userService.getAllPsychologists()
  }


  @Get('me')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  getLoggedUser(@Request() req) {
    return this.userService.getCurrentUser(req.user.sub)
  }

  /**
 
  params iten 
 
   */



  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  @ApiOperation({
    description: `# Esta rota deleta um usuário.
    Tipo: Autenticada. 
    Acesso: [Administrador]` })
  @ApiParam({ name: 'id', description: '### Id do usuário. ' })
  async delete(
    @Param('id') id: string
  ) {
    return this.userService.deleteUser(id)
  }

  @Get('/qrcode-2fa/:id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota obtém os dados para gerar o qr-code.
    Descrição: Este qr-code é usado para configurar o aplicativo que gera token.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: '### Id do usuário. ' })
  async getQrCode(
    @Param('id') id: string
  ) {
    return this.userService.generate2FAQRCode(id)
  }


  @Put('status-code/:id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({
    description: `# Esta rota habilita e desabilita a autenticação de dois fatores.
    Tipo: Autenticada. 
    Acesso: [Todos]` })
  @ApiParam({ name: 'id', description: '### Id do usuário. ' })
  @ApiBody({
    description: '### No corpo de requisição, passe a variável status que define se habilita ou desabilita a autenticação de dois fatores.',
    type: Qrcode2fa
  })
  async generate2fa(
    @Param('id') id: string,
    @Body() qrcode2fs: Qrcode2fa

  ) {
    return this.userService.generate2fa(id, qrcode2fs)
  }


  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({
    description: `# Esta rota busca um usuário pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo, Atendente]` })
  @ApiParam({ name: 'id', description: 'Id do usuário. ' })
  async findOne(
    @Param('id') id: string
  ): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({
    description: `# Esta rota atualiza um usuário pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo, Atendente]` })
  @ApiParam({ name: 'id', description: 'Id do usuário. ' })
  @ApiBody({
    description: '## Schema padrão para atualizar um usuário. ',
    type: UpdateUserDto
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('/status/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({
    description: `# Esta rota habilita e desabilita um usuário pelo Id.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })
  @ApiParam({ name: 'id', description: '### Id do usuário. ' })
  async changeStatus(
    @Param('id') id: string
  ): Promise<UserEntity> {
    return this.userService.changeStatus(id);
  }

  @Post('/patient')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({
    description: `# Esta rota cadastra um paciente.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo, Atendente]` })
  @ApiBody({
    description: '## Schema padrão para cadastrar um paciente. ',
    type: CreatePatientDto
  })
  async createPatient(
    @Body() createPatientDto: CreatePatientDto
  ): Promise<UserResponseDto> {
    return this.userService.createPatient(createPatientDto)
  }


  @Get('/patient/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({
    description: `# Esta rota busca um paciente por Id.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo, Atendente]` })
  @ApiParam({ name: 'id', description: '### Id do usuário. ' })
  async findPatient(
    @Param('id') id: string
  ): Promise<UserResponseDto> {
    return this.userService.findPatientWithPsychologist(id)
  }

  @Get('/psychologist/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({
    description: `# Esta rota busca os dados completos de um psicólogo por Id.
    Tipo: Autenticada. 
    Acesso: [Administrador, Psicólogo]` })
  @ApiParam({ name: 'id', description: '### Id do usuário. ' })
  async findPsychologist(
    @Param('id') id: string
  ): Promise<UserResponseDto> {
    return this.userService.findPsychologistWithPatients(id)
  }




  @Post('/patient/public')
  @PublicRoute()
  @ApiOperation({
    description: `# Esta rota cadastra um paciente.
    Tipo: Pública. 
    Acesso: [Livre]` })
  @ApiBody({
    description: '## Schema padrão para cadastrar um paciente. ',
    type: CreatePatientDto
  })
  async createPublicPatient(
    @Body() createPatientDto: CreatePatientDto
  ): Promise<UserResponseDto> {
    return this.userService.createPatient(createPatientDto)
  }


}
