
import { ApiProperty } from '@nestjs/swagger';


export class UpdateUserDto {
    @ApiProperty()
    user_name: string

    @ApiProperty()
    user_email: string

    @ApiProperty()
    user_profile_id: number
}
