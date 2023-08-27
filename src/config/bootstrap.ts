import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { ProfileService } from 'src/profile/profile.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';


@Injectable()
export class Bootstrap {
    constructor(
        private readonly userService: UserService,
        private readonly profileService: ProfileService
    ) { }

    async onApplicationBootstrap() {

        const profileHaveData = await this.profileService.haveProfile('ADMIN')
        const userHaveData = await this.userService.haveAdmin('sysadmin')

        let currentProfile = profileHaveData


        if (!profileHaveData) {

            const profile: CreateProfileDto = {
                profile_name: 'ADMIN'
            }

            currentProfile = await this.profileService.create(profile)
        }

        if (!userHaveData) {

            const user: CreateUserDto = {
                user_name: 'sysadmin',
                user_email: 'sysadmin@email.com',
                user_password: process.env.SYSADMIN_PASS,
                user_profile_id: currentProfile.profile_id,
                user_2fa_active: false,
                user_enrollment: '00001'
            }

            this.userService.create(user)
        }


    }
}