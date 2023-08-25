import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoricRecoverDto } from './dto/create-historic-recover.dto';
import { UpdateHistoricRecoverDto } from './dto/update-historic-recover.dto';
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

  findAll() {
    return `This action returns all historicRecover`;
  }

  findOne(id: number) {
    return `This action returns a #${id} historicRecover`;
  }

  update(id: number, updateHistoricRecoverDto: UpdateHistoricRecoverDto) {
    return `This action updates a #${id} historicRecover`;
  }

  remove(id: number) {
    return `This action removes a #${id} historicRecover`;
  }
}
