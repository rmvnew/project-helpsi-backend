import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { RecoverInterface } from 'src/common/interfaces/recover.interface';
import { getUserPath } from 'src/common/routes.path';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { FilterUser } from './dto/Filter.user';
import { CreateUserDto } from './dto/create-user.dto';
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
  ): Promise<UserEntity> {
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
    @Query() filter: FilterUser
  ): Promise<Pagination<UserResponseDto>> {


    filter.route = getUserPath()

    return this.userService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findOne(
    @Param('id') id: number
  ): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('/status/:id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async changeStatus(
    @Param('id') id: number
  ): Promise<UserEntity> {
    return this.userService.changeStatus(id);
  }

  @Patch('/change-password/:id/:currentPass/:firstPass/:secondPass')
  @UseGuards(PermissionGuard(AccessProfile.USER_AND_ADMIN))
  async changePassword(
    @Param('id') id: number,
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



}
