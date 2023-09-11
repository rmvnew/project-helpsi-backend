import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { CreateDiaryEntryDto } from './dto/create-diary_entry.dto';
import { DiaryFilter } from './dto/diary.filter';
import { UpdateDiaryEntryDto } from './dto/update-diary_entry.dto';
import { DiaryEntry } from './entities/diary_entry.entity';

@Injectable()
export class DiaryEntryService {

  private readonly logger = new Logger(DiaryEntryService.name)

  constructor(
    @InjectRepository(DiaryEntry)
    private readonly diaryEntryRepository: Repository<DiaryEntry>
  ) { }


  async create(createDiaryEntryDto: CreateDiaryEntryDto) {

    const diary = this.diaryEntryRepository.create(createDiaryEntryDto)

    return this.diaryEntryRepository.save(diary)
  }

  async findAll(filter: DiaryFilter) {

    try {
      const { sort, orderBy } = filter;

      const diaryQueryBuilder = this.diaryEntryRepository.createQueryBuilder('diary')
        .orderBy('diary.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);

      const page = await paginate<DiaryEntry>(diaryQueryBuilder, filter);

      page.links.first = page.links.first === '' ? '' : `${page.links.first}&sort=${sort}&orderBy=${orderBy}`;
      page.links.previous = page.links.previous === '' ? '' : `${page.links.previous}&sort=${sort}&orderBy=${orderBy}`;
      page.links.last = page.links.last === '' ? '' : `${page.links.last}&sort=${sort}&orderBy=${orderBy}`;
      page.links.next = page.links.next === '' ? '' : `${page.links.next}&sort=${sort}&orderBy=${orderBy}`;

      return page;

    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }
  }

  async findOne(id: string) {
    return this.diaryEntryRepository.findOne({
      where: {
        diary_entry_id: id
      }
    })
  }

  async update(id: string, updateDiaryEntryDto: UpdateDiaryEntryDto) {

    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException('Diario não encontrado')
    }

    const diary = await this.diaryEntryRepository.preload({
      diary_entry_id: id,
      ...updateDiaryEntryDto
    })

    return this.diaryEntryRepository.save(diary)
  }

  async remove(id: string) {
    const isRegistered = await this.findOne(id)

    if (!isRegistered) {
      throw new NotFoundException('Diario não encontrado')
    }

    await this.diaryEntryRepository.delete(isRegistered.diary_entry_id)
  }
}
