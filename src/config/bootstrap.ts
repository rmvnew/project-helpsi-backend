import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from 'src/profile/dto/create-profile.dto';
import { ProfileService } from 'src/profile/profile.service';
import { SpecialtyService } from 'src/specialty/specialty.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';


@Injectable()
export class Bootstrap {
    constructor(
        private readonly userService: UserService,
        private readonly profileService: ProfileService,
        private readonly specialtyService: SpecialtyService


    ) { }

    async onApplicationBootstrap() {


        const userHaveData = await this.userService.haveAdmin('sysadmin')

        await this.specialtyService.checkView()

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

            } else {

                if (profileHaveData.profile_name === 'ADMIN') {
                    currentProfile = profileHaveData
                }
            }
        }


        if (!userHaveData) {

            console.log('Profile: ', currentProfile);

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