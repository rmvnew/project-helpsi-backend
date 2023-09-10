import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { PatientDetails } from './entities/patient_detail.entity';
import { PatientDetailsController } from './patient_details.controller';
import { PatientDetailsService } from './patient_details.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PatientDetails, UserEntity])
  ],
  controllers: [PatientDetailsController],
  providers: [PatientDetailsService],
  exports: [PatientDetailsService]
})
export class PatientDetailsModule { }
