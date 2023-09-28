import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { paginate } from 'nestjs-typeorm-paginate';
import { UserEntity } from 'src/user/entities/user.entity';
import { Between, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { SchedulingFilter } from './dto/scheduling.filter';
import { Scheduling } from './entities/scheduling.entity';

@Injectable()
export class SchedulingService {

  private readonly logger = new Logger(SchedulingService.name)

  constructor(
    @InjectRepository(Scheduling)
    private readonly schedulingRepository: Repository<Scheduling>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }


  async create(createSchedulingDto: CreateSchedulingDto) {
    const {
      duration,
      patient_id,
      psychologist_id,
      select_date_time,
      registrant_name
    } = createSchedulingDto;


    const startDateTime = DateTime.fromISO(select_date_time.toString(), { zone: 'UTC' }).setZone('America/Manaus');

    const endDateTime = startDateTime.plus({ hours: duration });

    const existingAppointment = await this.schedulingRepository.findOne({
      where: [
        { start_time: LessThanOrEqual(startDateTime.toJSDate()), end_time: MoreThan(startDateTime.toJSDate()) },
        { start_time: LessThanOrEqual(endDateTime.toJSDate()), end_time: MoreThan(endDateTime.toJSDate()) }
      ]
    });

    if (existingAppointment) {
      throw new BadRequestException("Horário já foi reservado.");
    }

    const currentPatient = await this.getUserById(patient_id);

    if (!currentPatient) {
      throw new NotFoundException(`Paciente não encontrado!`)
    }

    const currentPsychologist = await this.getUserById(psychologist_id);

    if (!currentPsychologist) {
      throw new NotFoundException(`Psicólogo não encontrado!`)
    }

    const newAppointment = new Scheduling();
    newAppointment.start_time = startDateTime.toJSDate();
    newAppointment.end_time = endDateTime.toJSDate();
    newAppointment.patient = currentPatient;
    newAppointment.psychologist = currentPsychologist;
    newAppointment.registrant_name = registrant_name ? registrant_name : 'N/A'

    await this.schedulingRepository.save(newAppointment);
  }


  private getUserById(user_id: string) {
    return this.userRepository.findOne({
      where: {
        user_id: user_id
      }
    })
  }

  async checkAvailability(currentDate: string) {

    const selectedDate = new Date(currentDate);
    selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());

    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    const appointmentsForDay = await this.schedulingRepository.find({
      where: {
        start_time: Between(selectedDate, nextDay)
      },
      relations: ["psychologist"]
    });



    const timeSlots = this.generateTimeSlots(selectedDate);
    const schedule = [];

    for (const slot of timeSlots) {
      const matchingAppointment = appointmentsForDay.find(app =>
        app.start_time.getTime() === slot.getTime()
      );

      const psychologist_id = matchingAppointment ? matchingAppointment?.psychologist?.user_id : null

      delete matchingAppointment?.psychologist

      schedule.push({
        time: slot.toISOString(),
        isBooked: !!matchingAppointment,
        appointmentDetails: matchingAppointment || null,
        psychologistId: psychologist_id
      });
    }


    // console.log(schedule);

    return schedule;
  }

  generateTimeSlots(date: Date): Date[] {
    const UTC_OFFSET_MANAUS = 0;
    const startTime = 8;
    const endTime = 18;
    const slots = [];

    for (let hour = startTime; hour < endTime; hour++) {
      const slot = new Date(date);

      slot.setUTCHours(hour + UTC_OFFSET_MANAUS, 0, 0, 0);
      slots.push(slot);
    }

    return slots;
  }



  async findAll(filter: SchedulingFilter) {


    console.log('Filter: ', filter);

    try {
      const { sort, orderBy, patient_id, psychologist_id, start_time, end_time } = filter;


      const schedulingQueryBuilder = this.schedulingRepository.createQueryBuilder('task')




      if (patient_id) {
        schedulingQueryBuilder
          .andWhere('task.patient_id = :patient_id', { patient_id })
      }

      if (psychologist_id) {
        schedulingQueryBuilder
          .andWhere('task.psychologist_id = :psychologist_id', { psychologist_id })
      }


      if (start_time) {
        schedulingQueryBuilder
          .andWhere('task.start_time >= :start_time', { start_time })
      }

      if (end_time) {
        schedulingQueryBuilder
          .andWhere('task.end_time <= :end_time', { end_time })
      }


      schedulingQueryBuilder.orderBy('task.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);


      const page = await paginate<Scheduling>(schedulingQueryBuilder, filter);




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




}
