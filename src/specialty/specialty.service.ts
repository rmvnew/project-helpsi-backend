import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';
import { Specialty } from './entities/specialty.entity';

@Injectable()
export class SpecialtyService {

  private readonly logger = new Logger(SpecialtyService.name)

  constructor(
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>,

  ) { }


  async create(createSpecialtyDto: CreateSpecialtyDto) {

    try {
      const { specialty_name } = createSpecialtyDto

      const isRegistered = await this.findByName(specialty_name.toUpperCase())

      if (isRegistered) {
        throw new BadRequestException(`A especialidade já está cadastrada!!`)
      }

      const specialty = this.specialtyRepository.create(createSpecialtyDto)
      specialty.specialty_name = specialty_name.toUpperCase()

      return this.specialtyRepository.save(specialty)

    } catch (error) {
      this.logger.error(error)
    }
  }

  async saveAll(list: any) {

    try {

      const { specialties } = list

      for (let item of specialties) {

        const currentItem: CreateSpecialtyDto = {
          specialty_name: item
        }
        this.create(currentItem)
      }

    } catch (error) {
      this.logger.error(error)
    }

  }

  async findByName(name: string) {
    try {
      return this.specialtyRepository.findOne({
        where: {
          specialty_name: name
        }
      })
    } catch (error) {
      this.logger.error(error)
    }
  }

  async findAll() {
    try {
      return this.specialtyRepository.find()
    } catch (error) {
      this.logger.error(error)
    }
  }

  async findOne(id: string) {
    try {
      return this.specialtyRepository.findOne({
        where: {
          specialty_id: id
        }
      })
    } catch (error) {
      this.logger.error(error)
    }
  }

  async update(id: string, updateSpecialtyDto: UpdateSpecialtyDto) {

    try {

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

    } catch (error) {
      this.logger.error(error)
    }
  }

  async remove(id: string) {
    try {
      const isRegistered = await this.findOne(id)

      if (!isRegistered) {
        throw new NotFoundException(`Especialidade não foi encontrada!`)
      }

      this.specialtyRepository.delete(id)
    } catch (error) {
      this.logger.error(error)
    }

  }


  async checkView() {


    try {

      const exists = await this.specialtyRepository.query(`
    
      select * from vw_psychologists_spacialts

    `).catch(async (err) => {
        this.logger.warn(err)

        await this.specialtyRepository.query(`
          create view vw_psychologists_spacialts as
          select  
          u.user_id ,
          u.user_name,
          s.specialty_id ,
          s.specialty_name 
          from USER_SPECIALTY us 
          left join USER u on us.user_id = u.user_id 
          left JOIN SPECIALTY s on us.specialty_id = s.specialty_id 
      `).then(response => {
          this.logger.verbose('vw_psychologists_spacialts was created')
        })


      })




    } catch (error) {
      this.logger.error(error)
    }

  }



  async getAvailableSpacialties() {

    try {

      return this.specialtyRepository.query(`
      select DISTINCT  vps.specialty_id ,vps.specialty_name  from vw_psychologists_spacialts vps 
    `)
    } catch (error) {
      this.logger.error(error)
    }
  }


  async getPsychologistBySpecialty(specialty: string) {

    try {
      return this.specialtyRepository.query(`
      select vps.user_id,vps.user_name from vw_psychologists_spacialts vps
      WHERE vps.specialty_name = '${specialty}' 
    `)

    } catch (error) {
      this.logger.error(error)
    }
  }


}
