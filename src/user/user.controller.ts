import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import { totp } from 'otplib';
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

export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  // @PublicRoute()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }



  @Get('/profile')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findAllProfile(): Promise<ProfileEntity[]> {
    return this.userService.findAllProfile()
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
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


  @Patch('/change-password/:id/:currentPass/:firstPass/:secondPass')
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async changePassword(
    @Param('id') id: string,
    @Param('currentPass') currentPass: string,
    @Param('firstPass') firstPass: string,
    @Param('secondPass') secondPass: string
  ) {
    return this.userService.changePassword(id, currentPass, firstPass, secondPass)
  }


  @Post('/resetPass')
  @PublicRoute()
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
  async recoverCode(
    @Query('email') email: string
  ) {
    return this.userService.recoverCode(email)
  }


  @Get('/userEmail')
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async getUserByEmail(
    @Query('email') email: string
  ) {

    return this.userService.findUserByEmail(email)
  }

  @Post('test-2fa-otplib')
  @PublicRoute()
  test2FAOtplib(@Body() body: { secret: string, token: string }) {
    totp.options = { step: 30 }; // O padrão é 30 segundos, você pode ajustar se necessário.
    const isValid = totp.verify({ token: body.token, secret: body.secret });
    return { isValid };
  }


  @Get('/qrcode-2fa/:id')
  // @PublicRoute()
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async getQrCode(
    @Param('id') id: string
  ) {
    return this.userService.generate2FAQRCode(id)
  }


  @Put('status-code/:id')
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  // @PublicRoute()
  async generate2fa(
    @Param('id') id: string,
    @Body() qrcode2fs: Qrcode2fa

  ) {
    return this.userService.generate2fa(id, qrcode2fs)
  }




  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findOne(
    @Param('id') id: string
  ): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('/status/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async changeStatus(
    @Param('id') id: string
  ): Promise<UserEntity> {
    return this.userService.changeStatus(id);
  }

  @Post('/patient')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  // @PublicRoute()
  async createPatient(
    @Body() createPatientDto: CreatePatientDto
  ): Promise<UserResponseDto> {
    return this.userService.createPatient(createPatientDto)
  }


  @Get('/patient/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findPatient(
    @Param('id') id: string
  ): Promise<UserResponseDto> {
    return this.userService.findPatientWithPsychologist(id)
  }

  @Get('/psychologist/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findPsychologist(
    @Param('id') id: string
  ): Promise<UserResponseDto> {
    return this.userService.findPsychologistWithPatients(id)
  }


}
