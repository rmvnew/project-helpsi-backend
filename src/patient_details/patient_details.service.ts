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

    const patient_details = this.patientDetailsRepository.create(createPatientDetailDto)

    patient_details.start_date = new Date()

    return await this.patientDetailsRepository.save(patient_details)

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

    const patient_Details = await this.patientDetailsRepository.preload({
      patient_details_id: id,
      ...updatePatientDetailDto
    })

    return await this.patientDetailsRepository.save(patient_Details)

  }

  async remove(id: string) {
    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException('Nenhum registro encontrado!')
    }

    await this.patientDetailsRepository.delete(isRegistered.patient_details_id)
  }
}
