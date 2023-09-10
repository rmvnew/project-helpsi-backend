import { Module } from '@nestjs/common';
import { DiaryEntryService } from './diary_entry.service';
import { DiaryEntryController } from './diary_entry.controller';

@Module({
  controllers: [DiaryEntryController],
  providers: [DiaryEntryService]
})
export class DiaryEntryModule {}
