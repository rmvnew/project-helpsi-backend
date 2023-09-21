import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { SortingType } from 'src/common/Enums';
import { PsychologistBasicResponseDto } from 'src/user/dto/psychologist.basic.response.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { CreateUnavailableTimeDto } from './dto/create-unavailable-time.dto';
import { UnavailableFilter } from './dto/unavailable.filter';
import { UpdateUnavailableTimeDto } from './dto/update-unavailable-time.dto';
import { UnavailableTimes } from './entities/unavailable-time.entity';

@Injectable()
export class UnavailableTimesService {

  private readonly logger = new Logger(UnavailableTimesService.name)

  constructor(
    @InjectRepository(UnavailableTimes)
    private readonly repository: Repository<UnavailableTimes>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }



  async create(createUnavailableTimeDto: CreateUnavailableTimeDto) {

    const { unavailable_end_time, unavailable_psychologist_id, unavailable_start_time } = createUnavailableTimeDto

    const psychologist = await this.userRepository.findOne({
      where: {
        user_id: unavailable_psychologist_id
      }
    })

    if (!psychologist) {
      throw new NotFoundException(`O psicólogo não foi encontrado!`)
    }

    // Verifique se já existe um período indisponível que conflite com este
    const conflictingTimes = await this.repository.find({
      where: [
        { psychologist: { user_id: unavailable_psychologist_id }, unavailable_start_time: Between(unavailable_start_time, unavailable_end_time) },
        { psychologist: { user_id: unavailable_psychologist_id }, unavailable_end_time: Between(unavailable_start_time, unavailable_end_time) },
        { psychologist: { user_id: unavailable_psychologist_id }, unavailable_start_time: LessThanOrEqual(unavailable_start_time), unavailable_end_time: MoreThanOrEqual(unavailable_end_time) },
        { psychologist: { user_id: unavailable_psychologist_id }, unavailable_start_time: MoreThanOrEqual(unavailable_start_time), unavailable_end_time: LessThanOrEqual(unavailable_end_time) }
      ]
    });

    if (conflictingTimes.length > 0) {
      throw new ConflictException('Já existe um período indisponível que conflita com este.');
    }





    const unavailable = this.repository.create(createUnavailableTimeDto)
    unavailable.unavailable_start_time = unavailable_start_time
    unavailable.unavailable_end_time = unavailable_end_time
    unavailable.psychologist = psychologist


    return this.repository.save(unavailable)
  }

  async findAll(filter: UnavailableFilter): Promise<Pagination<UnavailableTimes>> {




    try {
      const { sort, orderBy, end_time, start_time, psychologist_name } = filter;

      const userQueryBuilder = this.repository.createQueryBuilder('task')
        .leftJoinAndSelect('task.psychologist', 'psychologist');

      if (psychologist_name) {
        userQueryBuilder.andWhere(`psychologist.user_name LIKE :psychologist_name`, {
          psychologist_name: `%${psychologist_name}%`
        });
      }

      if (start_time) {
        userQueryBuilder.andWhere('task.unavailable_start_time >= :start_time', {
          start_time
        });
      }

      if (end_time) {
        userQueryBuilder.andWhere('task.unavailable_end_time <= :end_time', {
          end_time
        });
      }

      if (orderBy === SortingType.DATE) {
        userQueryBuilder.orderBy('task.unavailable_start_time', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      } else {
        userQueryBuilder.orderBy('psychologist.user_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      }

      const page = await paginate<UnavailableTimes>(userQueryBuilder, filter);



      for (let unavailableItem of page.items) {

        const currentPsychologist = unavailableItem.psychologist

        unavailableItem['basicPsychologist'] = this.transformPsychologist(currentPsychologist)

        delete unavailableItem.psychologist

      }


      page.links.first = page.links.first === '' ? '' : `${page.links.first}&sort=${sort}&orderBy=${orderBy}`;
      page.links.previous = page.links.previous === '' ? '' : `${page.links.previous}&sort=${sort}&orderBy=${orderBy}`;
      page.links.last = page.links.last === '' ? '' : `${page.links.last}&sort=${sort}&orderBy=${orderBy}`;
      page.links.next = page.links.next === '' ? '' : `${page.links.next}&sort=${sort}&orderBy=${orderBy}`;

      return page;
    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }
  }

  transformPsychologist(psychologist: UserEntity): PsychologistBasicResponseDto {
    return plainToClass(PsychologistBasicResponseDto, psychologist, {
      excludeExtraneousValues: true
    });
  }


  async findOne(id: string) {
    return this.repository.findOne({
      where: {
        unavailable_id: id
      }
    })
  }

  async update(id: string, updateUnavailableTimeDto: UpdateUnavailableTimeDto) {

    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException(`registro não encontrado!`)
    }

    const { unavailable_end_time, unavailable_start_time } = updateUnavailableTimeDto

    const unavailable = await this.repository.preload({
      unavailable_id: id,
      ...updateUnavailableTimeDto
    })


    if (unavailable_start_time) {
      unavailable.unavailable_start_time = unavailable_start_time
    }

    if (unavailable_end_time) {
      unavailable.unavailable_end_time = unavailable_end_time
    }


    return this.repository.save(unavailable)
  }

  async remove(id: string) {
    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException(`registro não encontrado!`)
    }

    this.repository.delete(isRegistered.unavailable_id)
  }



  async findFutureAndPresentRangesByPsychologistId(psychologistId: string): Promise<UnavailableTimes[]> {


    const currentDate = new Date();

    const records = await this.repository
      .createQueryBuilder('unavailability')
      .where('unavailability.psychologist_id = :psychologistId', { psychologistId })
      .andWhere('unavailability.unavailable_end_time >= :currentDate', { currentDate })
      .orderBy('unavailability.unavailable_start_time', 'ASC')
      .getMany();



    return records;
  }


  async findAllDatesWithinRanges(psychologistId: string): Promise<string[]> {

    const ranges = await this.findFutureAndPresentRangesByPsychologistId(psychologistId);
    const allDates: string[] = [];

    for (const range of ranges) {

      let currentDate = new Date(range.unavailable_start_time);
      const endDate = new Date(range.unavailable_end_time);

      while (currentDate <= endDate) {
        allDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }

    }

    return allDates;
  }



}
