import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import AccessProfile from 'src/auth/enums/permission.type';
import { PermissionGuard } from 'src/auth/shared/guards/permission.guard';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { SpecialtyService } from './specialty.service';

@Controller('specialty')
@ApiTags('Specialty')
@ApiBearerAuth()


export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) { }

  @Post()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtyService.create(createSpecialtyDto);
  }

  @Get()
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  findAll() {
    return this.specialtyService.findAll();
  }

  @Get(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  findOne(@Param('id') id: string) {
    return this.specialtyService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  update(@Param('id') id: string, @Body() updateSpecialtyDto: UpdateSpecialtyDto) {
    return this.specialtyService.update(id, updateSpecialtyDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard(AccessProfile.ADMIN))
  remove(@Param('id') id: string) {
    return this.specialtyService.remove(id);
  }
}
