import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Between, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
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

    const { duration, patient_id, psychologist_id, selectDateTime } = createSchedulingDto

    const existingAppointment = await this.schedulingRepository.findOne({
      where: [
        { startTime: LessThanOrEqual(selectDateTime), endTime: MoreThan(selectDateTime) },
        { startTime: LessThan(new Date(selectDateTime.getTime() + duration)), endTime: MoreThanOrEqual(selectDateTime) }
      ]

    });

    if (existingAppointment) {
      throw new Error("The selected time slot is already booked.");
    }

    const currentPatient = await this.getUserById(patient_id)
    const currentPsychologist = await this.getUserById(psychologist_id)

    const newAppointment = new Scheduling();

    newAppointment.startTime = selectDateTime;
    newAppointment.endTime = new Date(selectDateTime.getTime() + duration);
    newAppointment.patient = currentPatient;
    newAppointment.psychologist = currentPsychologist;
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

    const selectedDate = new Date(currentDate); // Exemplo de data 2023-05-15
    const nextDay = new Date(selectedDate);
    nextDay.setDate(selectedDate.getDate() + 1);

    const appointmentsForDay = await this.schedulingRepository.find({
      where: {
        startTime: Between(selectedDate, nextDay)
      }
    });

    const timeSlots = this.generateTimeSlots(selectedDate);
    const schedule = [];

    for (const slot of timeSlots) {
      const matchingAppointment = appointmentsForDay.find(app =>
        app.startTime.getTime() === slot.getTime()
      );

      schedule.push({
        time: slot,
        isBooked: !!matchingAppointment,
        appointmentDetails: matchingAppointment || null
      });
    }

    return schedule

  }

  generateTimeSlots(date: Date): Date[] {
    const startTime = 8; // 8 AM
    const endTime = 17; // 5 PM
    const slots = [];

    for (let hour = startTime; hour < endTime; hour++) {
      const slot = new Date(date);
      slot.setHours(hour, 0, 0, 0);
      slots.push(slot);
    }

    return slots;
  }



}
