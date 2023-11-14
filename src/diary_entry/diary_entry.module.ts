import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientDetailsModule } from 'src/patient_details/patient_details.module';
import { DiaryEntryController } from './diary_entry.controller';
import { DiaryEntryService } from './diary_entry.service';
import { DiaryEntry } from './entities/diary_entry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntry]),
    PatientDetailsModule
  ],
  controllers: [DiaryEntryController],
  providers: [DiaryEntryService],
  exports: [DiaryEntryService]
})
export class DiaryEntryModule { }
