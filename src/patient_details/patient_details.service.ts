import { Injectable } from '@nestjs/common';
import { CreatePatientDetailDto } from './dto/create-patient_detail.dto';
import { UpdatePatientDetailDto } from './dto/update-patient_detail.dto';

@Injectable()
export class PatientDetailsService {
  create(createPatientDetailDto: CreatePatientDetailDto) {
    return 'This action adds a new patientDetail';
  }

  findAll() {
    return `This action returns all patientDetails`;
  }

  findOne(id: number) {
    return `This action returns a #${id} patientDetail`;
  }

  update(id: number, updatePatientDetailDto: UpdatePatientDetailDto) {
    return `This action updates a #${id} patientDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} patientDetail`;
  }
}
