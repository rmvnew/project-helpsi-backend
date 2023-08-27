import { Expose } from "class-transformer"

export class UserResponseDto {

    @Expose()
    user_id: number

    @Expose()
    user_name: string

    @Expose()
    user_email: string

    @Expose()
    user_status: boolean

    @Expose()
    user_2fa_active: boolean

    @Expose()
    user_enrollment: string

    @Expose()
    user_profile_id: number

    @Expose()
    create_at: Date

    @Expose()
    update_at: Date
}