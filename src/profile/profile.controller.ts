import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()


export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  // @PublicRoute()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async create(
    @Body() createProfileDto: CreateProfileDto
  ) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findAll() {
    return this.profileService.findAll();
  }

  @Get('/get-patient')
  @PublicRoute()
  async getPatient() {
    return this.profileService.getPatient();
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async findOne(@Param('id') id: string) {
    return this.profileService.findById(+id);
  }

  @Put(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  async update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }


}
