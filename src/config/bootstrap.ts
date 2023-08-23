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

        const profileHaveData = await this.profileService.haveData()
        const userHaveData = await this.userService.haveData()

        if (!profileHaveData && !userHaveData) {

            const profile: CreateProfileDto = {
                profile_name: 'ADMIN'
            }

            const profileSaved = await this.profileService.create(profile)

            const user: CreateUserDto = {
                user_name: 'sysadmin',
                user_email: 'sysadmin@email.com',
                user_password: process.env.SYSADMIN_PASS,
                user_profile_id: profileSaved.profile_id
            }

            this.userService.create(user)
        }


    }
}