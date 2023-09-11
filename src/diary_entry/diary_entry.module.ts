import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntryController } from './diary_entry.controller';
import { DiaryEntryService } from './diary_entry.service';
import { DiaryEntry } from './entities/diary_entry.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DiaryEntry])
  ],
  controllers: [DiaryEntryController],
  providers: [DiaryEntryService],
  exports: [DiaryEntryService]
})
export class DiaryEntryModule { }
