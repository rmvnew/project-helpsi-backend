import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileEntity } from './entities/profile.entity';

@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>
  ) { }


  async create(createProfileDto: CreateProfileDto): Promise<ProfileEntity> {

    const profile = this.profileRepository.create(createProfileDto)

    return this.profileRepository.save(profile)
  }

  async findAll() {
    return this.profileRepository.find()
  }

  async haveProfile(name: string) {
    return this.profileRepository.findOne({
      where: {
        profile_name: name
      }
    })
  }

  async findById(id: number) {
    return this.profileRepository.findOne({
      where: {
        profile_id: id
      }
    })
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {


    const profileIsRegistered = await this.findById(id)

    if (!profileIsRegistered) {
      throw new NotFoundException(`Perfil não encontrado!!`)
    }

    const profile = await this.profileRepository.preload({
      profile_id: id,
      ...updateProfileDto
    })

    await this.profileRepository.save(profile)

    return this.findById(id)
  }


}
