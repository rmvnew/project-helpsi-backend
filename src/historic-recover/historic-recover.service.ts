import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoricRecoverDto } from './dto/create-historic-recover.dto';
import { HistoricRecover } from './entities/historic-recover.entity';

@Injectable()
export class HistoricRecoverService {


  constructor(
    @InjectRepository(HistoricRecover)
    private readonly historicRepository: Repository<HistoricRecover>
  ) { }


  async create(createHistoricRecoverDto: CreateHistoricRecoverDto) {

    const { historicQuantity } = createHistoricRecoverDto

    const historic = this.historicRepository.create(createHistoricRecoverDto)
    historic.historicRecoverDate = new Date()
    historic.historicQuantity = 1

    this.historicRepository.save(historic)
  }

  async findByDate(date: string, userId: string) {

    return this.historicRepository.createQueryBuilder('historic')
      .where("DATE(historic.historicRecoverDate) = :date", { date: date.toString().split('T')[0] })
      .andWhere('historic.user = :user', { user: userId })
      .getOne()

  }


}
