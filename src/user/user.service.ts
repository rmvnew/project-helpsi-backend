import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { AddressResponseDto } from 'src/address/dto/address.response.dto';
import { Address } from 'src/address/entities/address.entity';
import { SortingType, ValidType } from 'src/common/Enums';
import { Utils } from 'src/common/Utils';
import { CodeRecoverInterface, WellcomeInterface } from 'src/common/interfaces/email.interface';
import { RecoverInterface } from 'src/common/interfaces/recover.interface';
import { Validations } from 'src/common/validations';
import { HistoricRecover } from 'src/historic_recover/entities/historic-recover.entity';
import { HistoricRecoverService } from 'src/historic_recover/historic-recover.service';
import { MailService } from 'src/mail/mail.service';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { ProfileService } from 'src/profile/profile.service';
import { SpecialtyResponseDto } from 'src/specialty/dto/specialty.response.dto';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { Repository } from 'typeorm';
import { CreateHistoricRecoverDto } from '../historic_recover/dto/create-historic-recover.dto';
import { FilterUser } from './dto/Filter.user';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserGoogleDto } from './dto/create-user.google.dto';
import { ListPsychologistResponseDto } from './dto/list.psychologist.response.dto';
import { PatientResponseDto } from './dto/patient.response.dto';
import { PsychologistBasicResponseDto } from './dto/psychologist.basic.response.dto';
import { PsychologistResponseDto } from './dto/psychologist.response.dto';
import { Qrcode2fa } from './dto/qrcode.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UserResponseLoginDto } from './dto/user.response.login.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {


  private readonly logger = new Logger(UserService.name)

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly profileService: ProfileService,
    private readonly mailservice: MailService,
    private readonly historicRecoverService: HistoricRecoverService,
    @InjectRepository(HistoricRecover)
    private readonly historicRecoverRepository: Repository<HistoricRecover>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Specialty)
    private readonly specialtyRepository: Repository<Specialty>

  ) { }



  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {



    try {

      const {
        user_name,
        user_profile_id: profile_id,
        user_email,
        user_password,
        user_date_of_birth,
        user_crp,
        specialtys
      } = createUserDto

      if (user_name.trim() == '' || user_name == undefined) {
        throw new BadRequestException(`O nome não pode estar vazio`)
      }

      if (user_email.trim() == '' || user_email == undefined) {
        throw new BadRequestException(`O email não pode estar vazio`)
      }

      const user = this.userRepository.create(createUserDto)

      user.user_name = user_name.toUpperCase()

      Validations.getInstance().validateWithRegex(
        user.user_name,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER,
        ValidType.IS_STRING
      )

      Validations.getInstance().validateWithRegex(
        user.user_email,
        ValidType.IS_EMAIL,
        ValidType.NO_SPACE
      )

      Validations.getInstance().verifyLength(
        user.user_name, 'Name', 5, 40
      )

      const userIsRegistered = await this.findByName(user.user_name)

      if (userIsRegistered) {
        throw new BadRequestException(`user already registered`)
      }

      const emailIsRegistered = await this.findByEmail(user.user_email)

      if (emailIsRegistered) {
        throw new BadRequestException(`email already registered`)
      }

      user.user_password = await Utils.getInstance().encryptPassword(user_password)

      const profile = await this.findProfileById(profile_id)
      if (!profile) {
        throw new NotFoundException(`Perfil não encontrado`)
      }

      user.profile = profile
      user.user_status = true
      user.user_first_access = true
      user.setTwoFactorSecret()
      user.user_enrollment = Utils.getInstance().getEnrollmentCode()
      user.user_2fa_active = false
      user.user_crp = user_crp
      user.specialtys = specialtys

      const dateParts = user_date_of_birth.split("/");
      user.user_date_of_birth = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));

      const userSaved = this.userRepository.save(user)


      const userDto: UserResponseDto = plainToClass(UserResponseDto, userSaved, {
        excludeExtraneousValues: true
      });

      return userDto

    } catch (error) {
      this.logger.warn(`createUser error: ${error.message}`, error.stack);
      throw error
    }

  }

  async findAllProfile(): Promise<ProfileEntity[]> {
    try {
      return this.profileRepository.find()
    } catch (error) {
      this.logger.error(`findAllProfiles error: ${error.message}`, error.stack)
      throw error
    }
  }



  async findProfileById(id: number): Promise<ProfileEntity> {
    try {
      return this.profileRepository.findOne({
        where: {
          profile_id: id
        }
      })
    } catch (error) {
      this.logger.error(`findProfileById error: ${error.message}`, error.stack)
      throw error
    }
  }


  async findAll(filter: FilterUser): Promise<Pagination<UserResponseDto>> {

    try {
      const { sort, orderBy, user_name, showActives } = filter;


      const userQueryBuilder = this.userRepository.createQueryBuilder('user');
      if (showActives === "true") {
        userQueryBuilder.andWhere('user.user_status = true');
      }
      if (user_name) {
        userQueryBuilder.andWhere(`user.user_name LIKE :user_name`, {
          user_name: `%${user_name}%`
        });
      }
      if (orderBy == SortingType.DATE) {
        userQueryBuilder.orderBy('user.create_at', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      } else {
        userQueryBuilder.orderBy('user.user_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`);
      }
      const page = await paginate<UserEntity>(userQueryBuilder, filter);


      for (let user of page.items) {


        if (user.user_id) {

          const currentUser = await this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.address', 'address')
            .leftJoinAndSelect('user.psychologist', 'psychologist')
            .where('user.user_id = :id', { id: user.user_id })
            .getOne()

          const currentAddress = currentUser.address
          const currentPsychologist = currentUser.psychologist

          const specialtys = await this.specialtyRepository.createQueryBuilder("specialty")
            .innerJoin("specialty.users", "user")
            .where("user.user_id = :userId", { userId: user.user_id })
            .getMany();

          const specialtyDtos = specialtys.map(specialty => {
            return {
              specialty_id: specialty.specialty_id,
              specialty_name: specialty.specialty_name,
              users: specialty.users
            }
          });

          user.specialtys = specialtyDtos;
          user.address = this.transformAddress(currentAddress)
          user['basicPsychologist'] = this.transformPsychologist(currentPsychologist)



        }
      }



      const userDtos: UserResponseDto[] = plainToClass(UserResponseDto, page.items, {
        excludeExtraneousValues: true
      });



      const transformedPage = {
        ...page,
        items: userDtos,
      };


      transformedPage.links.first = transformedPage.links.first === '' ? '' : `${transformedPage.links.first}&sort=${sort}&orderBy=${orderBy}`;
      transformedPage.links.previous = transformedPage.links.previous === '' ? '' : `${transformedPage.links.previous}&sort=${sort}&orderBy=${orderBy}`;
      transformedPage.links.last = transformedPage.links.last === '' ? '' : `${transformedPage.links.last}&sort=${sort}&orderBy=${orderBy}`;
      transformedPage.links.next = transformedPage.links.next === '' ? '' : `${transformedPage.links.next}&sort=${sort}&orderBy=${orderBy}`;

      return transformedPage;

    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error;
    }
  }


  transformSpecialtys(specialtys: Specialty[]): SpecialtyResponseDto[] {
    return plainToClass(SpecialtyResponseDto, specialtys, {
      excludeExtraneousValues: true
    });
  }

  transformAddress(address: Address): AddressResponseDto {
    return plainToClass(AddressResponseDto, address, {
      excludeExtraneousValues: true
    });
  }

  transformPsychologist(psychologist: UserEntity): PsychologistBasicResponseDto {
    return plainToClass(PsychologistBasicResponseDto, psychologist, {
      excludeExtraneousValues: true
    });
  }


  async findByEmail(email: string) {
    try {
      return this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.user_email = :user_email', { user_email: email })
        .getOne()

    } catch (error) {
      this.logger.error(`findByEmail error: ${error.message}`, error.stack)
      throw error
    }
  }


  async findUserByEmail(email: string) {

    try {

      const user = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.user_email = :user_email', { user_email: email })
        .getOne()



      const userDto: UserResponseLoginDto = plainToClass(UserResponseLoginDto, user, {
        excludeExtraneousValues: true
      });

      userDto.profile = user.profile

      return userDto

    } catch (error) {
      this.logger.error(`findByEmail error: ${error.message}`, error.stack)
      throw error
    }
  }

  async getCurrentUser(id: string): Promise<UserResponseLoginDto> {
    try {

      const user = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .leftJoinAndSelect('user.address', 'address')
        .leftJoinAndSelect('user.psychologist', 'psychologist')
        .where('user.user_id = :user_id', { user_id: id })
        .getOne()

      const currentProfile = user.profile
      const currentAddress = user.address
      const currentPsychologist = user.psychologist

      user.address = this.transformAddress(currentAddress)
      user['basicPsychologist'] = this.transformPsychologist(currentPsychologist)

      const userDto: UserResponseLoginDto = plainToClass(UserResponseLoginDto, user, {
        excludeExtraneousValues: true
      });


      userDto.profile = currentProfile

      return userDto

    } catch (error) {
      this.logger.error(`findById error: ${error.message}`, error.stack)
      throw error
    }
  }

  async findById(id: string): Promise<UserResponseDto> {

    try {

      const user = await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.user_id = :user_id', { user_id: id })
        .getOne()

      const userDto: UserResponseDto = plainToClass(UserResponseDto, user, {
        excludeExtraneousValues: true
      });

      return userDto

    } catch (error) {
      this.logger.error(`findById error: ${error.message}`, error.stack)
      throw error
    }

  }


  async findByName(name: string): Promise<UserResponseDto> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          user_name: name
        }
      })


      const userDto: UserResponseDto = plainToClass(UserResponseDto, user, {
        excludeExtraneousValues: true
      })

      return userDto

    } catch (error) {
      this.logger.error(`findByName error: ${error.message}`, error.stack)
      throw error
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {




    try {



      const {
        user_name,
        user_email,
        user_profile_id: profile_id,
        user_date_of_birth,
        user_phone,
        user_genre,
        user_cpf,
        user_rg,
        psychologist_id
      } = updateUserDto



      const isRegistered = await this.findById(id)


      if (!isRegistered) {
        throw new NotFoundException(`User does not exist`)
      }



      const user = await this.userRepository.preload({
        user_id: id,
        ...updateUserDto
      })


      if (user_name) {

        user.user_name = user_name.toUpperCase()

        Validations.getInstance().validateWithRegex(
          user.user_name,
          ValidType.NO_MANY_SPACE,
          ValidType.NO_SPECIAL_CHARACTER,
          ValidType.IS_STRING
        )

        Validations.getInstance().verifyLength(
          user.user_name, 'Name', 5, 40)

      }

      if (user_email) {

        user.user_email = user_email

        Validations.getInstance().validateWithRegex(
          user.user_email,
          ValidType.IS_EMAIL,
          ValidType.NO_SPACE
        )

      }

      if (profile_id) {

        const profile = await this.findProfileById(profile_id)

        if (!profile) {
          throw new NotFoundException(`Perfil não encontrado`)
        }
        user.profile = profile
      }

      if (psychologist_id) {

        const currentPsychologist = await this.userRepository.findOne({
          where: {
            user_id: psychologist_id
          }
        })

        if (!currentPsychologist) {
          throw new NotFoundException(`Psicólogo não encontrado!`)
        }

        user.psychologist = currentPsychologist

      }

      if (user_phone) {
        user.user_phone = user_phone
      }

      if (user_genre) {
        user.user_genre = user_genre
      }

      if (user_cpf) {
        user.user_cpf = user_cpf
      }
      if (user_rg) {
        user.user_rg = user_rg
      }


      const [day, month, year] = user_date_of_birth.split("/")

      user.user_date_of_birth = new Date(+year, +month - 1, +day)



      await this.userRepository.save(user)

      return this.findById(id)

    } catch (error) {
      this.logger.error(`updateUser error: ${error.message}`, error.stack)
      throw error
    }
  }




  async deleteUser(id: string) {

    const isRegistered = await this.userRepository.findOne({
      where: {
        user_id: id
      }
    })


    if (!isRegistered) {
      throw new NotFoundException(`User does not exist`)
    }

    await this.userRepository.delete(id)


  }

  async changeStatus(id: string) {

    try {

      const userSaved = await this.findById(id)

      if (!userSaved) {
        throw new NotFoundException(`User does not exist`)
      }

      const { user_status: status } = userSaved

      console.log(userSaved);


      userSaved.user_status = status === true ? false : true

      return this.userRepository.save(userSaved)

    } catch (error) {
      this.logger.error(`changeStatus error: ${error.message}`, error.stack)
      throw error
    }
  }

  async updateRefreshToken(id: string, refresh_token: string) {

    try {

      const user = await this.userRepository.findOne({
        where: {
          user_id: id
        }
      })

      if (!user) {
        throw new NotFoundException(`user with id ${id} does not exist`)
      }

      user.user_refresh_token = refresh_token

      await this.userRepository.save(user)

    } catch (error) {
      this.logger.error(`updateRefreshToken error: ${error.message}`, error.stack)
      throw error
    }
  }

  async changeFirstAccess(id: string) {

    try {

      const userSaved = await this.userRepository.findOne({
        where: {
          user_id: id
        }
      })

      if (!userSaved) {
        throw new NotFoundException(`user with id ${id} does not exist`)
      }

      const { user_first_access: status } = userSaved

      if (status) {

        userSaved.user_first_access = false

        await this.userRepository.save(userSaved)

        return {
          Status: 'Success',
          Message: 'first access status successfully modified'
        }
      }

      return {
        Status: 'Fail',
        Message: 'This is not the first login since this user'
      }

    } catch (error) {
      this.logger.error(`changeFirstAccess error: ${error.message}`, error.stack)
      throw error
    }

  }



  async resetPassword(recover: RecoverInterface) {

    try {

      const { code, password, email } = recover

      const user = await this.userRepository.findOne({
        where: {
          user_email: email,
          user_recovery_code: code
        }
      })

      if (!user) {
        throw new BadRequestException(`O código: ${code} não é válido!`)
      }

      user.user_password = await Utils.getInstance().encryptPassword(password)
      user.user_recovery_code = null

      this.userRepository.save(user)

    } catch (error) {
      this.logger.error(`resetPass error: ${error.message}`, error.stack)
      throw error
    }
  }



  async haveAdmin(name: string) {

    try {

      const admin = await this.userRepository.findOne({
        where: {
          user_name: name.toUpperCase()
        }
      })

      if (admin) {
        return true
      } else {
        return false
      }

    } catch (error) {
      this.logger.error(`haveAdmin error: ${error.message}`, error.stack)
      throw error
    }

  }


  async recoverCode(email: string) {

    try {
      const user = await this.findByEmail(email)


      if (!user) {
        throw new NotFoundException(`O email informado é inválido!`)
      }


      const currentDate = this.getCurrentDate()

      const currentHistoric = await this.historicRecoverService.findByDate(currentDate, user.user_id)

      if (currentHistoric) {

        if (currentHistoric.historicQuantity >= 3) {
          throw new BadGatewayException(`Número maximo de tentativas diarias excedido!`)
        }

        console.log('CurrentHistoric: ', currentHistoric);

        currentHistoric.historicQuantity = currentHistoric.historicQuantity + 1
        this.historicRecoverRepository.save(currentHistoric)

      } else {
        const historic: CreateHistoricRecoverDto = {
          historicQuantity: 1,
          user: user
        }

        this.historicRecoverService.create(historic)
      }


      const code = this.generateCode()

      user.user_recovery_code = code
      user.user_recovery_date = new Date()


      await this.userRepository.save(user)

      const codeRecover: CodeRecoverInterface = {
        name: user.user_name,
        code: code,
        email: user.user_email
      }



      this.mailservice.sendMail(codeRecover)

      setTimeout(async () => {
        await this.clearCode(user)
      }, 5 * 60 * 1000)


    } catch (error) {
      this.logger.error(`recoverCode error: ${error.message}`, error.stack);
      throw error
    }


  }


  getCurrentDate() {

    const currentdate = new Date()
    const day: string = String(currentdate.getDate()).padStart(2, '0')
    const month: string = String(currentdate.getMonth() + 1).padStart(2, '0')
    const year: number = currentdate.getFullYear()

    return `${year}-${month}-${day}`

  }

  async clearCode(user: UserEntity) {
    user.user_recovery_code = null
    await this.userRepository.save(user)
  }


  generateCode() {
    const minNumber = 100000;
    const maxNumber = 999999;

    const randomNumber = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    return randomNumber
  }





  async generate2FAQRCode(user_id: string): Promise<string> {

    const user = await this.userRepository.findOne({
      where: {
        user_id: user_id
      }
    })

    const otpauth = speakeasy.otpauthURL({
      secret: user.user_2fa_secret,
      label: `HelPsi:${user.user_email}`,
      algorithm: 'sha1'
    });

    return QRCode.toDataURL(otpauth);
  }



  async generate2fa(user_id: string, qrcode2fa: Qrcode2fa) {
    try {
      const { status } = qrcode2fa

      const user = await this.userRepository.findOne({
        where: {
          user_id: user_id
        }
      })

      status ? user.setTwoFactorSecret() : user.user_2fa_secret = ''
      user.user_2fa_active = status

      await this.userRepository.save(user)

      const customPromisse = new Promise((resolve) => {
        if (status === true) {
          // console.log('1');
          resolve(this.generate2FAQRCode(user_id))
        } else {
          // console.log('2');
          resolve('Authenticação de dois fatores desabilitada')
        }
      })

      return customPromisse

    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Erro ao tentar gerar 2FA',
      }, HttpStatus.BAD_REQUEST);
    }
  }


  async createPatient(createPatientDto: CreatePatientDto): Promise<UserResponseDto> {

    try {
      const {
        user_name,
        user_email,
        user_password,
        psychologist_id,
        user_date_of_birth,
        user_cpf,
        user_rg
      } = createPatientDto;



      if (!user_name || user_name.trim() === '') {
        throw new BadRequestException(`O nome não pode estar vazio`);
      }

      if (!user_email || user_email.trim() === '') {
        throw new BadRequestException(`O email não pode estar vazio`);
      }

      const patient = this.userRepository.create(createPatientDto);

      patient.user_name = user_name.toUpperCase();

      Validations.getInstance().validateWithRegex(
        patient.user_name,
        ValidType.NO_MANY_SPACE,
        ValidType.NO_SPECIAL_CHARACTER,
        ValidType.IS_STRING
      );

      Validations.getInstance().validateWithRegex(
        patient.user_email,
        ValidType.IS_EMAIL,
        ValidType.NO_SPACE
      );

      Validations.getInstance().verifyLength(
        patient.user_name, 'Name', 5, 40
      );

      const patientIsRegistered = await this.findByName(patient.user_name);
      if (patientIsRegistered) {
        throw new BadRequestException(`Paciente já registrado`);
      }

      const emailIsRegistered = await this.findByEmail(patient.user_email);
      if (emailIsRegistered) {
        throw new BadRequestException(`Email já registrado`);
      }

      patient.user_password = await Utils.getInstance().encryptPassword(user_password);


      if (psychologist_id) {
        const psychologist = await this.userRepository.findOne({
          where: {
            user_id: psychologist_id
          }
        });

        if (!psychologist) {
          throw new NotFoundException(`Psicólogo não encontrado`);
        }

        patient.psychologist = psychologist ? psychologist : null;
      }

      const patientProfile = await this.profileRepository.findOne({
        where: {
          profile_name: 'PATIENT'
        }
      })


      patient.user_status = true;
      patient.user_first_access = true;
      patient.profile = patientProfile
      patient.setTwoFactorSecret();
      patient.user_enrollment = Utils.getInstance().getEnrollmentCode()
      patient.user_2fa_active = false
      patient.user_cpf = user_cpf
      patient.user_rg = user_rg

      const dateParts = user_date_of_birth.split("/");
      patient.user_date_of_birth = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));



      const patientSaved = await this.userRepository.save(patient);

      const patientDto: UserResponseDto = plainToClass(UserResponseDto, patientSaved, {
        excludeExtraneousValues: true
      });

      return patientDto;

    } catch (error) {
      this.logger.error(`createPatient error: ${error.message}`, error.stack);
      throw error;
    }
  }


  async findPatientWithPsychologist(patient_id: string): Promise<PatientResponseDto | null> {
    try {
      const patient = await this.userRepository
        .createQueryBuilder('patient')
        .leftJoinAndSelect('patient.psychologist', 'psychologist')
        .leftJoinAndSelect('patient.address', 'address')
        .where('patient.user_id = :patient_id', { patient_id })
        .getOne();

      if (!patient) {
        throw new NotFoundException(`Paciente com ID ${patient_id} não encontrado`);
      }

      console.log('Patient: ', patient);

      const psychologistDto = plainToClass(PsychologistResponseDto, patient.psychologist, {
        excludeExtraneousValues: true
      });

      const patientDto: PatientResponseDto = plainToClass(PatientResponseDto, patient, {
        excludeExtraneousValues: true
      });

      patientDto.psychologist = psychologistDto
      patientDto.address = patient.address

      return patientDto;

    } catch (error) {
      this.logger.error(`findPatientWithPsychologist error: ${error.message}`, error.stack);
      throw error;
    }
  }


  async findPsychologistWithPatients(psychologist_id: string): Promise<PsychologistResponseDto | null> {
    try {
      const psychologist = await this.userRepository
        .createQueryBuilder('psychologist')
        .leftJoinAndSelect('psychologist.patients', 'patient')
        .where('psychologist.user_id = :psychologist_id', { psychologist_id })
        .getOne();

      if (!psychologist) {
        throw new NotFoundException(`Psicólogo com ID ${psychologist_id} não encontrado`);
      }

      const patientsDto = psychologist.patients.map(patient => plainToClass(PatientResponseDto, patient, {
        excludeExtraneousValues: true
      }));

      const psychologistDto = plainToClass(PsychologistResponseDto, psychologist, {
        excludeExtraneousValues: true
      });
      psychologistDto.patients = patientsDto;

      return psychologistDto;

    } catch (error) {
      this.logger.error(`findPsychologistWithPatients error: ${error.message}`, error.stack);
      throw error;
    }
  }


  async getAllPsychologists() {
    const psychologists = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.specialtys', 'specialtys')
      .where('profile.profile_name = :name', { name: `PSYCHOLOGIST` })
      .getMany()


    const userDto: ListPsychologistResponseDto[] = plainToClass(ListPsychologistResponseDto, psychologists, {
      excludeExtraneousValues: true
    })


    let currentPsychologists = []


    for (let psy of userDto) {


      const specialtys = await this.specialtyRepository.createQueryBuilder("specialty")
        .innerJoin("specialty.users", "user")
        .where("user.user_id = :userId", { userId: psy.user_id })
        .getMany();

      const specialtiesDto: SpecialtyResponseDto[] = plainToClass(SpecialtyResponseDto, specialtys, {
        excludeExtraneousValues: true
      })

      delete psy.specialties

      psy['specialtys'] = specialtiesDto

      currentPsychologists.push(psy)

    }



    return currentPsychologists


  }


  async createPatientWithGoogle(userGoogle: CreateUserGoogleDto) {

    const { google_id, user_email, user_name, google_picture } = userGoogle

    const user = this.userRepository.create(userGoogle)

    const currentPassword = Utils.getInstance().generatePassword()

    const currentProfile = await this.profileService.getPatient()

    user.user_name = user_name.toUpperCase()
    user.user_email = user_email
    user.google_id = google_id
    user.profile = currentProfile
    user.user_status = true
    user.user_first_access = true
    user.setTwoFactorSecret()
    user.user_2fa_active = false
    user.google_picture = google_picture

    const msg: WellcomeInterface = {
      email: user_email,
      name: user_name
    }

    this.mailservice.wallcomeMesage(msg)


    return this.userRepository.save(user)


  }


  async checkingRegisterCompleteByEmail(email: string) {

    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.psychologist', 'psychologist')
      .leftJoinAndSelect('user.address', 'address')
      .where('user.user_email = :user_email', { user_email: email })
      .getOne()

    const fieldsToCheck = ['user_rg', 'user_cpf', 'psychologist', 'address'];

    const isComplete = fieldsToCheck.every(field => user[field] !== null);

    return isComplete;

  }



}
