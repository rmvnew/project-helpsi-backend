import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { execSync } from 'child_process';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { paginate } from 'nestjs-typeorm-paginate';
import { GeneralMailInterface, mailDataPatientInterface } from 'src/common/interfaces/email.interface';
import { MailService } from 'src/mail/mail.service';
import { PatientDetailsService } from 'src/patient_details/patient_details.service';
import { UserEntity } from 'src/user/entities/user.entity';
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
    private readonly patientDetailsService: PatientDetailsService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly mailService: MailService
  ) { }


  async create(createDiaryEntryDto: CreateDiaryEntryDto) {


    const { patient_details_id, text } = createDiaryEntryDto

    if (!patient_details_id) {
      throw new BadRequestException('Patient details não encontrada')
    }

    const details = await this.patientDetailsService.findOne(patient_details_id)

    const diary = this.diaryEntryRepository.create(createDiaryEntryDto)

    diary.patient_details = details

    const emotion = this.classifyTextMin(text)

    const current = emotion.data.emotion

    const dataFormatada = format(new Date(emotion.data.timestamp), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR });

    // Aqui busco dados do psicologo que está assossiado ao paciente xD
    const patient = await this.userRepository.findOne({
      where: {
        patientDetails: { patient_details_id }
      },
      relations: ['psychologist']
    })

    const psy_mail = patient.psychologist.user_email

    const emotion_data: mailDataPatientInterface = {
      hour: dataFormatada,
      text,
      patient_name: patient.user_name,
      psy_mail,
      patient_mail: patient.user_email,
      level_of_joy: current.alegria,
      level_of_disgust: current.desgosto,
      level_of_fear: current.medo,
      anger_level: current.raiva,
      level_of_surprise: current.surpresa,
      level_of_sadness: current.tristeza

    }

    this.sendMailToPsychologist(emotion_data)




    return this.diaryEntryRepository.save(diary)


  }


  async sendMailToPsychologist(mail_options: mailDataPatientInterface) {

    const current_mail = `
    
    <!DOCTYPE html>
    <html lang="pt">
    <head>
        <meta charset="UTF-8">
        <title>Alerta de Emoções do Paciente</title>
        <style>
            .container {
                font-family: Arial, sans-serif; 
                border: 1px solid #e0e0e0; 
                padding: 20px; 
                max-width: 600px; 
                margin: auto; 
                background-color: #f9f9f9;
            }
            h2 {
                text-align: center;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            }
            th, td {
                border: 1px solid #ddd;
                text-align: left;
                padding: 8px;
            }
            th {
                background-color: #f2f2f2;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }

            .card-text{
              font-size: 0.8rem;
              border-radius: 10px;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
              background-color: #eee;
              color: rgb(0, 75, 94);
            }

            .card-hour {
              display: flex;
              margin-top: 20px;
              border-radius: 10px;
              box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
            }


            .hour-title {
             
              margin-top: 0;
              margin-bottom: 0;
              margin-left: 20px;
              border-bottom-left-radius: 10px;
              border-top-left-radius: 10px;
              text-align: center; /* Centraliza o texto horizontalmente */
              display: flex;
              align-items: center; /* Centraliza o conteúdo verticalmente */
              justify-content: center; /* Centraliza o conteúdo horizontalmente quando usando flex */
              padding: 10px 0; /* Ajuste o padding conforme necessário para melhor aparência */
            }

            


        </style>
    </head>
    <body>
        <div class="container">
            <img src="https://github.com/rmvnew/rmvnew/blob/main/logo_oficial_2.png?raw=true" alt="Logo da Helpsi" style="display: block; margin: auto; width: 200px;">
            
            <h2 style="color: #333;">Diário de Emoção do Paciente</h2>
            
            <p>Prezado(a) psicólogo(a),</p>
            
            <p>Informamos que o paciente <b style="color: blue;">${mail_options.patient_name}</b>, 
                registrou um novo texto em seu diário de emoções.</p>
            
            <h5><i>Texto do(a) paciente</i></h5>
            <div class="card-text">
            
              <p>${mail_options.text}</p>

            </div>

            <div class="card-hour">
              <p class="hour-title">Data e hora da coleta: ${mail_options.hour}</p>
              
            </div>

            <table>
                <tr>
                    <th>Emoção</th>
                    <th>Percentual (%)</th>
                </tr>
                <tr>
                    <td>Alegria</td>
                    <td>${mail_options.level_of_joy}</td>
                </tr>
                <tr>
                    <td>Desgosto</td>
                    <td>${mail_options.level_of_disgust}</td>
                </tr>
                <tr>
                    <td>Medo</td>
                    <td>${mail_options.level_of_fear}</td>
                </tr>
                <tr>
                    <td>Raiva</td>
                    <td>${mail_options.anger_level}</td>
                </tr>
                <tr>
                    <td>Surpresa</td>
                    <td>${mail_options.level_of_surprise}</td>
                </tr>
                <tr >
                    <td>Tristeza</td>
                    <td>${mail_options.level_of_sadness}</td>
                </tr>
            </table>
            <br>
            
            <p>Esta tabela mostra a análise dos níveis emocionais do paciente com base na última sessão. 
                É importante considerar esses dados para acompanhar o progresso e o bem-estar do paciente.</p>
            
            <p>Com carinho,</p>
            <p>Equipe da Helpsi</p>
        </div>
    </body>
    </html>




    `

    const general_data: GeneralMailInterface = {
      to: mail_options.psy_mail,
      from: mail_options.patient_mail,
      subject: `Novo diário de Emoção do Paciente [${mail_options.patient_name.toUpperCase()}]`,
      html: current_mail
    }


    // console.log(general_data);

    this.mailService.generalMail(general_data)

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
