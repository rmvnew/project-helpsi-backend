import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { UserEntity } from 'src/user/entities/user.entity';
import { Between, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { CreateSchedulingDto } from './dto/create-scheduling.dto';
import { Scheduling } from './entities/scheduling.entity';

@Injectable()
export class SchedulingService {



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


    const startDateTime = DateTime.fromISO(select_date_time, { zone: 'UTC' }).setZone('America/Manaus');

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
    const currentPsychologist = await this.getUserById(psychologist_id);

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
      }
    });

    const timeSlots = this.generateTimeSlots(selectedDate);
    const schedule = [];

    for (const slot of timeSlots) {
      const matchingAppointment = appointmentsForDay.find(app =>
        app.start_time.getTime() === slot.getTime()
      );

      schedule.push({
        time: slot.toISOString(),
        isBooked: !!matchingAppointment,
        appointmentDetails: matchingAppointment || null
      });
    }

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






}
