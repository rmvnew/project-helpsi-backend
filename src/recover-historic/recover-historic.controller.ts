import { Body, Controller, Post } from '@nestjs/common';
import { CreateRecoverHistoricDto } from './dto/create-recover-historic.dto';
import { RecoverHistoricService } from './recover-historic.service';

@Controller('recover-historic')
export class RecoverHistoricController {
  constructor(private readonly recoverHistoricService: RecoverHistoricService) { }

  @Post()
  create(@Body() createRecoverHistoricDto: CreateRecoverHistoricDto) {
    return this.recoverHistoricService.create(createRecoverHistoricDto);
  }


}
