import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistoricRecoverService } from './historic-recover.service';
import { CreateHistoricRecoverDto } from './dto/create-historic-recover.dto';
import { UpdateHistoricRecoverDto } from './dto/update-historic-recover.dto';

@Controller('historic-recover')
export class HistoricRecoverController {
  constructor(private readonly historicRecoverService: HistoricRecoverService) {}

  @Post()
  create(@Body() createHistoricRecoverDto: CreateHistoricRecoverDto) {
    return this.historicRecoverService.create(createHistoricRecoverDto);
  }

  @Get()
  findAll() {
    return this.historicRecoverService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historicRecoverService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistoricRecoverDto: UpdateHistoricRecoverDto) {
    return this.historicRecoverService.update(+id, updateHistoricRecoverDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historicRecoverService.remove(+id);
  }
}
