import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import AccessProfile from 'src/auth/enums/permission.type';
import { PublicRoute } from 'src/common/decorators/public_route.decorator';

@Controller('profile')
@ApiTags('Profile')
@ApiBearerAuth()
// @UseGuards(PermissionGuard(AccessProfile.ADMIN))


export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  @PublicRoute()
  async create(
    @Body() createProfileDto: CreateProfileDto
  ) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  async findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.profileService.findById(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }


}
