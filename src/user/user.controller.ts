import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ description: 'Add new user - [ADMIN, PSYCHOLOGIST, ATTENDANT]' })
  @ApiBody({
    description: 'Data to create user',
    type: CreateUserDto
  })
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }


  @Get('/profile')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({ description: 'Get all profiles - [ADMIN, PSYCHOLOGIST, ATTENDANT]' })
  async findAllProfile(): Promise<ProfileEntity[]> {
    return this.userService.findAllProfile()
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({ description: 'Get all users with or no filter by name - [ADMIN, PSYCHOLOGIST, ATTENDANT]' })
  @ApiParam({ name: 'user_name', description: 'User name' })
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
  @ApiOperation({ description: 'Public route to reset password with code' })
  @ApiParam({ name: 'code', description: 'Code generated with expiration in five minutes ' })
  @ApiParam({ name: 'password', description: 'New password ' })
  @ApiParam({ name: 'email', description: 'Email of the user who will reset the password ' })
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
  @ApiOperation({ description: 'Public route to send email with new code generated' })
  @ApiParam({ name: 'email', description: 'Email of the user who will reset the password ' })
  async recoverCode(
    @Query('email') email: string
  ) {
    return this.userService.recoverCode(email)
  }


  @Get('/userEmail')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({ description: 'Route to get user by e-mail - [ADMIN, PSYCHOLOGIST, ATTENDANT]' })
  @ApiParam({ name: 'email', description: 'Email of the user you are looking for ' })
  async getUserByEmail(
    @Query('email') email: string
  ) {

    return this.userService.findUserByEmail(email)
  }


  @Get('/allPsychologists')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({ description: 'Route to get all psichologists - [ALL]' })
  async getAllPsychologists() {

    return this.userService.getAllPsychologists()
  }

  /**
 
  params iten 
 
   */



  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  @ApiOperation({ description: 'Route to delete user - [ADMIN]' })
  @ApiParam({ name: 'id', description: 'User id ' })
  async delete(
    @Param('id') id: string
  ) {
    return this.userService.deleteUser(id)
  }

  @Get('/qrcode-2fa/:id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({ description: 'Route that gets data to generate the qrcode - [ALL]' })
  @ApiParam({ name: 'id', description: 'User id ' })
  async getQrCode(
    @Param('id') id: string
  ) {
    return this.userService.generate2FAQRCode(id)
  }


  @Put('status-code/:id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({ description: 'Route that enables and disables two-factor authentication - [ALL]' })
  @ApiParam({ name: 'id', description: 'User id ' })
  @ApiBody({
    description: 'Boolean parameter to enable or disable two-factor authentication',
    type: Qrcode2fa
  })
  async generate2fa(
    @Param('id') id: string,
    @Body() qrcode2fs: Qrcode2fa

  ) {
    return this.userService.generate2fa(id, qrcode2fs)
  }


  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ALL))
  @ApiOperation({ description: 'Route that enables and disables two-factor authentication - [User,Admin]' })
  @ApiParam({ name: 'id', description: 'User id ' })
  async findOne(
    @Param('id') id: string
  ): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({ description: 'Route to update user - [ADMIN, PSYCHOLOGIST, ATTENDANT]' })
  @ApiParam({ name: 'id', description: 'User id ' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('/status/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({ description: 'Route to enable or disable user - [ADMIN, PSYCHOLOGIST]' })
  @ApiParam({ name: 'id', description: 'User id ' })
  async changeStatus(
    @Param('id') id: string
  ): Promise<UserEntity> {
    return this.userService.changeStatus(id);
  }

  @Post('/patient')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({ description: 'Route to create patient - [ADMIN, PSYCHOLOGIST, ATTENDANT]' })
  @ApiBody({
    description: 'Data to create user',
    type: CreatePatientDto
  })
  async createPatient(
    @Body() createPatientDto: CreatePatientDto
  ): Promise<UserResponseDto> {
    return this.userService.createPatient(createPatientDto)
  }


  @Get('/patient/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST_ATTENDANT))
  @ApiOperation({ description: 'Route to get patient by id - [ADMIN, PSYCHOLOGIST, ATTENDANT]' })
  @ApiParam({ name: 'id', description: 'User id ' })
  async findPatient(
    @Param('id') id: string
  ): Promise<UserResponseDto> {
    return this.userService.findPatientWithPsychologist(id)
  }

  @Get('/psychologist/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN_PSYCHOLOGIST))
  @ApiOperation({ description: 'Route to get psychologist with all your patients - [ADMIN, PSYCHOLOGIST]' })
  @ApiParam({ name: 'id', description: 'User id ' })
  async findPsychologist(
    @Param('id') id: string
  ): Promise<UserResponseDto> {
    return this.userService.findPsychologistWithPatients(id)
  }


}
