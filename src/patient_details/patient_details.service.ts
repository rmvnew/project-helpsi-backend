import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePatientDetailDto } from './dto/create-patient_detail.dto';
import { UpdatePatientDetailDto } from './dto/update-patient_detail.dto';
import { PatientDetails } from './entities/patient_detail.entity';

@Injectable()
export class PatientDetailsService {


  constructor(
    @InjectRepository(PatientDetails)
    private readonly patientDetailsRepository: Repository<PatientDetails>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async create(createPatientDetailDto: CreatePatientDetailDto) {

    const { last_session_date } = createPatientDetailDto

    const { patient_id } = createPatientDetailDto

    const currentPatient = await this.userRepository.findOne({
      where: {
        user_id: patient_id
      }
    })


    const patient_details = this.patientDetailsRepository.create(createPatientDetailDto)


    patient_details.start_date = new Date()
    patient_details.last_session_date = new Date(last_session_date)

    const saved = await this.patientDetailsRepository.save(patient_details)

    currentPatient.patientDetails = saved

    await this.userRepository.save(currentPatient)

    return saved
  }



  async findOne(id: string) {
    return this.patientDetailsRepository.findOne({
      where: {
        patient_details_id: id
      }
    })
  }

  async update(id: string, updatePatientDetailDto: UpdatePatientDetailDto) {


    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException('Nenhum registro encontrado!')
    }

    const { patient_id } = updatePatientDetailDto

    const patient_Details = await this.patientDetailsRepository.preload({
      patient_details_id: id,
      ...updatePatientDetailDto
    })


    const currentPatient = await this.userRepository.findOne({
      where: {
        user_id: patient_id
      }
    })

    const saved = await this.patientDetailsRepository.save(patient_Details)

    currentPatient.patientDetails = saved

    await this.userRepository.save(currentPatient)

    return saved
  }

  async remove(id: string) {
    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException('Nenhum registro encontrado!')
    }

    await this.patientDetailsRepository.delete(isRegistered.patient_details_id)
  }
}
