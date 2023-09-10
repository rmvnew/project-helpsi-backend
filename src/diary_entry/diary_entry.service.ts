import { Injectable } from '@nestjs/common';
import { CreateDiaryEntryDto } from './dto/create-diary_entry.dto';
import { UpdateDiaryEntryDto } from './dto/update-diary_entry.dto';

@Injectable()
export class DiaryEntryService {
  create(createDiaryEntryDto: CreateDiaryEntryDto) {
    return 'This action adds a new diaryEntry';
  }

  findAll() {
    return `This action returns all diaryEntry`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diaryEntry`;
  }

  update(id: number, updateDiaryEntryDto: UpdateDiaryEntryDto) {
    return `This action updates a #${id} diaryEntry`;
  }

  remove(id: number) {
    return `This action removes a #${id} diaryEntry`;
  }
}
