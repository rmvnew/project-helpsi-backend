import { Module } from '@nestjs/common';
import { PatientDetailsService } from './patient_details.service';
import { PatientDetailsController } from './patient_details.controller';

@Module({
  controllers: [PatientDetailsController],
  providers: [PatientDetailsService]
})
export class PatientDetailsModule {}
