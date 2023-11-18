import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { execSync } from 'child_process';
import { paginate } from 'nestjs-typeorm-paginate';
import { PatientDetailsService } from 'src/patient_details/patient_details.service';
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
    private readonly diaryEntryRepository: Repository<DiaryEntry>,
    private readonly patientDetailsService: PatientDetailsService
  ) { }


  async create(createDiaryEntryDto: CreateDiaryEntryDto) {


    const { patient_details_id } = createDiaryEntryDto

    if (!patient_details_id) {
      throw new BadRequestException('Patient details não encontrada')
    }

    const details = await this.patientDetailsService.findOne(patient_details_id)

    const diary = this.diaryEntryRepository.create(createDiaryEntryDto)
    diary.patient_details = details

    return this.diaryEntryRepository.save(diary)
  }

  async findAll(filter: DiaryFilter) {

    try {
      const { sort, orderBy, user_id } = filter;


      const diaryQueryBuilder = this.diaryEntryRepository.createQueryBuilder('diary')
        .leftJoinAndSelect('diary.patient_details', 'patient')
        .leftJoin('patient.user', 'user') // Usamos 'leftJoin' aqui para não selecionar todos os detalhes do usuário
        .addSelect('user.user_id')
        .addSelect('user.user_name')



      if (user_id) {
        diaryQueryBuilder
          .andWhere('user.user_id = :user_id', { user_id })
      }



      diaryQueryBuilder
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





  classifyText(text: string): any {
    // const scriptPath = join('/home/ricardo/Project/UNINORTE/Project-Helpsi/back/src/common/ia/text_classification.py');

    // try {
    //   const rawOutput = execSync(`python3 ${scriptPath} "${text}"`, { encoding: 'utf-8' });
    //   console.log('Saída Bruta:', rawOutput);

    //   if (rawOutput && typeof rawOutput === 'string') {
    //     try {
    //       const result = JSON.parse(rawOutput);
    //       return result;
    //     } catch (err) {
    //       console.error('Erro ao analisar a saída JSON:', err);
    //       return { error: 'Erro ao analisar a saída JSON' };
    //     }
    //   } else {
    //     console.error('Saída do script Python está vazia');
    //     return { error: 'Saída do script Python está vazia' };
    //   }
    // } catch (err) {
    //   console.error('Um erro ocorreu durante a execução do script Python:', err);
    //   console.error('Stderr:', err.stderr?.toString() || 'N/A');
    //   return { error: 'Erro durante a execução do script Python' };
    // }

    try {
      // const pythonOutput = execSync(`python3 /home/ricardo/Project/UNINORTE/Project-Helpsi/back/src/common/ia/teste.py "${text}"`, {
      //   encoding: 'utf-8',
      // });

      const pythonOutput = execSync(`python3 src/common/ia/teste.py "${text}"`, {
        encoding: 'utf-8',
      });
      const result = JSON.parse(pythonOutput);

      const res = this.processEmotionData(result)

      return res;
    } catch (error) {
      console.error('Error running Python script:', error);
      return null;
    }
  }


  classifyTextMin(text: string): any {

    try {

      const pythonOutput = execSync(`python3 src/common/ia/min2.py "${text}"`, {
        encoding: 'utf-8',
      });
      const result = JSON.parse(pythonOutput);

      console.log('Res: ', result);

      return result;
    } catch (error) {
      console.error('Error running Python script:', error);
      return null;
    }
  }


  convertToPercentage(emotion: Record<string, number>): Record<string, string> {
    let percentageEmotion: Record<string, string> = {};

    for (const [key, value] of Object.entries(emotion)) {
      percentageEmotion[key] = `${(value * 100).toFixed(2)}%`;
    }

    return percentageEmotion;
  }

  processEmotionData(data: any): any {
    const { text, emotion } = data;

    const emotionInPercentage = this.convertToPercentage(emotion);

    return {
      text,
      emotion: emotionInPercentage
    };
  }


}
