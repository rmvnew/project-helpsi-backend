import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecoverHistoricDto } from './dto/create-recover-historic.dto';
import { HistoricRecover } from './entities/recover-historic.entity';

@Injectable()
export class RecoverHistoricService {

  constructor(
    @InjectRepository(HistoricRecover)
    private readonly historicRepository: Repository<HistoricRecover>
  ) { }

  async create(createRecoverHistoricDto: CreateRecoverHistoricDto) {

    const { recover_quantity, user } = createRecoverHistoricDto

    const historic = this.historicRepository.create(createRecoverHistoricDto)

    historic.recover_date = new Date()
    historic.recover_quantity = recover_quantity
    historic.user = user

    this.historicRepository.save(historic)
  }



}
