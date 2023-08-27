import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    user_name: string

    @ApiProperty()
    user_email: string

    @ApiProperty()
    user_password: string

    @ApiProperty()
    user_profile_id: number

    @ApiProperty()
    user_2fa_active: boolean
}
