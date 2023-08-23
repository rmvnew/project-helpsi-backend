import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Pagination, paginate } from 'nestjs-typeorm-paginate';
import { ObjectSize, SortingType, ValidType } from 'src/common/Enums';
import { Utils } from 'src/common/Utils';
import { Validations } from 'src/common/validations';
import { ProfileEntity } from 'src/profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { FilterUser } from './dto/Filter.user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>
  ) { }



  async create(createUserDto: CreateUserDto) {

    const { user_name, user_profile_id: profile_id, user_email, user_password } = createUserDto

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

    return this.userRepository.save(user)

  }

  async findAllProfile(): Promise<ProfileEntity[]> {
    return this.profileRepository.find()
  }

  async findProfileById(id: number): Promise<ProfileEntity> {
    return this.profileRepository.findOne({
      where: {
        profile_id: id
      }
    })
  }



  async findAll(filter: FilterUser): Promise<Pagination<UserEntity>> {

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

  }

  async findByEmail(email: string) {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.user_email = :user_email', { user_email: email })
      .getOne()
  }

  async findById(id: number): Promise<UserEntity> {
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


  }

  async findByName(name: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: {
        user_name: name
      }
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {

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
  }

  async changeStatus(id: number) {

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

  }

  async updateRefreshToken(id: number, refresh_token: string) {

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

  }

  async changeFirstAccess(id: number) {

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

  }

  async changePassword(id: number, currentPassword: string, firstPass: string, secondPass: string) {

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

  }

  async resetPassword(email: string): Promise<UserEntity> {

    Validations.getInstance().validateWithRegex(
      email,
      ValidType.IS_EMAIL,
      ValidType.NO_SPACE
    )

    const user = await this.findByEmail(email)
    if (!user) {
      throw new NotFoundException(`user with email ${email} does not exist`)
    }

    const hasPass = await Utils.getInstance().encryptPassword(`${new Date().getFullYear()}`)

    const newPass = hasPass.substring(20, 28)

    user.user_password = await Utils.getInstance().encryptPassword(newPass)

    user.user_first_access = true

    const userSaved = await this.userRepository.save(user)

    userSaved.user_password = newPass

    return userSaved

  }



  async haveData() {
    const count = await this.userRepository.count();

    if (count === 0) {
      return false
    } else {
      return true
    }
  }

}
