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


        const userHaveData = await this.userService.haveAdmin('sysadmin')

        let currentProfile = null

        const profiles = ['ADMIN', 'PATIENT', 'PSYCHOLOGIST', 'ATTENDANT']

        for (let prof of profiles) {

            const profileHaveData = await this.profileService.haveProfile(prof)

            if (!profileHaveData) {

                const profile: CreateProfileDto = {
                    profile_name: prof
                }

                if (profile.profile_name === 'ADMIN') {
                    currentProfile = profile
                }

                await this.profileService.create(profile)

            }
        }


        if (!userHaveData) {

            const user: CreateUserDto = {
                user_name: 'sysadmin',
                user_email: 'sysadmin@email.com',
                user_phone: '00000000000',
                user_password: process.env.SYSADMIN_PASS,
                user_profile_id: currentProfile.profile_id,
                user_date_of_birth: '01/01/1970'

            }



            this.userService.create(user)
        }


    }
}