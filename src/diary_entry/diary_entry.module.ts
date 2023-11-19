import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/mail/mail.module';
import { PatientDetailsModule } from 'src/patient_details/patient_details.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { DiaryEntryController } from './diary_entry.controller';
import { DiaryEntryService } from './diary_entry.service';
import { DiaryEntry } from './entities/diary_entry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntry, UserEntity]),
    PatientDetailsModule,
    EmailModule
  ],
  controllers: [DiaryEntryController],
  providers: [DiaryEntryService],
  exports: [DiaryEntryService]
})
export class DiaryEntryModule { }
