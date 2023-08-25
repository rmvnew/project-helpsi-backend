import { Body, Controller, Post } from '@nestjs/common';
import { CreateHistoricRecoverDto } from './dto/create-historic-recover.dto';
import { HistoricRecoverService } from './historic-recover.service';

@Controller('historic-recover')
export class HistoricRecoverController {
  constructor(private readonly historicRecoverService: HistoricRecoverService) { }

  @Post()
  create(@Body() createHistoricRecoverDto: CreateHistoricRecoverDto) {
    return this.historicRecoverService.create(createHistoricRecoverDto);
  }


}
