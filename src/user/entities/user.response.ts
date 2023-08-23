import { ProfileEntity } from "src/profile/entities/profile.entity"

export class UserReponse {

    user_name: string

    user_email: string

    user_profile_id: number

    profile: ProfileEntity

    user_status: boolean

}