import { BadGatewayException, BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ObjectSize, SortingType, ValidType } from 'src/common/Enums';
import { Utils } from 'src/common/Utils';
import { CodeRecoverInterface } from 'src/common/interfaces/email.interface';
import { RecoverInterface } from 'src/common/interfaces/recover.interface';
import { Validations } from 'src/common/validations';
import { HistoricRecover } from 'src/historic-recover/entities/historic-recover.entity';
import { HistoricRecoverService } from 'src/historic-recover/historic-recover.service';
import { MailService } from 'src/mail/mail.service';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { CreateHistoricRecoverDto } from '../historic-recover/dto/create-historic-recover.dto';
import { FilterUser } from './dto/Filter.user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {

  private readonly logger = new Logger(UserService.name)

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
    private readonly mailservice: MailService,
    private readonly historicRecoverService: HistoricRecoverService,
    @InjectRepository(HistoricRecover)
    private readonly historicRecoverRepository: Repository<HistoricRecover>

  ) { }



  async create(createUserDto: CreateUserDto) {

    try {
      const {
        user_name,
        user_profile_id: profile_id,
        user_email,
        user_password,
        user_2fa_active
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
      user.user_2fa_active = user_2fa_active

      return this.userRepository.save(user)
    } catch (error) {
      this.logger.error(`createUser error: ${error.message}`, error.stack);
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



  async findAll(filter: FilterUser): Promise<Pagination<UserEntity>> {

    try {
      const { sort, orderBy, user_name } = filter

      const queryBuilder = this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')

      if (user_name) {

        queryBuilder
          .where(`user.user_name like :user_name`, {
            user_name: `%${user_name}%`
          })

      }

      if (orderBy == SortingType.ID) {

        queryBuilder.orderBy('user.user_id', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)

      } else {

        queryBuilder.orderBy('user.user_name', `${sort === 'DESC' ? 'DESC' : 'ASC'}`)

      }

      const page = await paginate<UserEntity>(queryBuilder, filter)

      page.links.first = page.links.first === '' ? '' : `${page.links.first}&sort=${sort}&orderBy=${orderBy}`
      page.links.previous = page.links.previous === '' ? '' : `${page.links.previous}&sort=${sort}&orderBy=${orderBy}`
      page.links.last = page.links.last === '' ? '' : `${page.links.last}&sort=${sort}&orderBy=${orderBy}`
      page.links.next = page.links.next === '' ? '' : `${page.links.next}&sort=${sort}&orderBy=${orderBy}`

      return page

    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack)
      throw error
    }

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

  async findById(id: number): Promise<UserEntity> {
    try {
      Validations.getInstance().validateWithRegex(
        `${id}`,
        ValidType.IS_NUMBER
      )
      if (id > ObjectSize.INTEGER) {
        throw new BadRequestException(`Invalid id number`)
      }

      return this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.profile', 'profile')
        .where('user.user_id = :user_id', { user_id: id })
        .getOne()

    } catch (error) {
      this.logger.error(`findById error: ${error.message}`, error.stack)
      throw error
    }

  }

  async findByName(name: string): Promise<UserEntity> {
    try {
      return this.userRepository.findOne({
        where: {
          user_name: name
        }
      })
    } catch (error) {
      this.logger.error(`findByName error: ${error.message}`, error.stack)
      throw error
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {

    try {
      Validations.getInstance().validateWithRegex(
        `${id}`,
        ValidType.IS_NUMBER
      )

      if (id > ObjectSize.INTEGER) {
        throw new BadRequestException(`Invalid id number`)
      }

      const { user_name, user_email, user_profile_id: profile_id } = updateUserDto

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

      await this.userRepository.save(user)

      return this.findById(id)

    } catch (error) {
      this.logger.error(`updateUser error: ${error.message}`, error.stack)
      throw error
    }
  }

  async changeStatus(id: number) {

    try {

      Validations.getInstance().validateWithRegex(
        `${id}`,
        ValidType.IS_NUMBER
      )

      if (id > ObjectSize.INTEGER) {
        throw new BadRequestException(`Invalid id number`)
      }

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

  async updateRefreshToken(id: number, refresh_token: string) {

    try {

      Validations.getInstance().validateWithRegex(
        `${id}`,
        ValidType.IS_NUMBER
      )

      if (id > ObjectSize.INTEGER) {
        throw new BadRequestException(`Invalid id number`)
      }

      const user = await this.findById(id)

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

  async changeFirstAccess(id: number) {

    try {
      Validations.getInstance().validateWithRegex(
        `${id}`,
        ValidType.IS_NUMBER
      )

      if (id > ObjectSize.INTEGER) {
        throw new BadRequestException(`Invalid id number`)
      }

      const userSaved = await this.findById(id)

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

  async changePassword(id: number, currentPassword: string, firstPass: string, secondPass: string) {

    try {

      Validations.getInstance().validateWithRegex(
        `${id}`,
        ValidType.IS_NUMBER
      )

      if (id > ObjectSize.INTEGER) {
        throw new BadRequestException(`Invalid id number`)
      }

      if (firstPass !== secondPass) {
        throw new BadRequestException(`Passwords do not match`)
      }

      const user = await this.findById(id)

      if (!user) {
        throw new NotFoundException(`user with id ${id} does not exist`)
      }

      const checkPass = bcrypt.compareSync(currentPassword, user.user_password);

      if (!checkPass) {
        throw new BadRequestException(`Entered password is incorrect`)
      }

      Validations.getInstance().validateWithRegex(
        firstPass,
        ValidType.NO_SPACE
      )

      Validations.getInstance().verifyLength(
        firstPass.trim(), 'Password', 5, 10
      )

      user.user_password = await Utils.getInstance().encryptPassword(firstPass)

      user.user_first_access = false

      await this.userRepository.save(user)

      return {
        Status: 'Success',
        Message: 'Password changed successfully'
      }

    } catch (error) {
      this.logger.error(`changePass error: ${error.message}`, error.stack)
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





}
