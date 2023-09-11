import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { Specialty } from './entities/specialty.entity';

@Injectable()
export class SpecialtyService {


  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>
  ) { }


  async create(createSpecialtyDto: CreateSpecialtyDto) {

    const { specialty_name } = createSpecialtyDto

    const isRegistered = await this.findByName(specialty_name.toUpperCase())

    if (isRegistered) {
      throw new BadRequestException(`A especialidade já está cadastrada!!`)
    }

    const specialty = this.specialtyRepository.create(createSpecialtyDto)
    specialty.specialty_name = specialty_name.toUpperCase()

    return this.specialtyRepository.save(specialty)
  }

  async saveAll(list: any) {


    const { specialties } = list

    for (let item of specialties) {

      const currentItem: CreateSpecialtyDto = {
        specialty_name: item
      }
      this.create(currentItem)
    }


  }

  async findByName(name: string) {
    return this.specialtyRepository.findOne({
      where: {
        specialty_name: name
      }
    })
  }

  async findAll() {
    return this.specialtyRepository.find()
  }

  async findOne(id: string) {
    return this.specialtyRepository.findOne({
      where: {
        specialty_id: id
      }
    })
  }

  async update(id: string, updateSpecialtyDto: UpdateSpecialtyDto) {

    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException(`Especialidade não foi encontrada!`)
    }

    const { specialty_name } = updateSpecialtyDto

    const specialty = await this.specialtyRepository.preload({
      specialty_id: id,
      ...updateSpecialtyDto
    })


    if (specialty_name) {
      specialty.specialty_name = specialty_name.toUpperCase()
    }

    return this.specialtyRepository.save(specialty)
  }

  async remove(id: string) {
    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException(`Especialidade não foi encontrada!`)
    }

    this.specialtyRepository.delete(id)

  }
}
