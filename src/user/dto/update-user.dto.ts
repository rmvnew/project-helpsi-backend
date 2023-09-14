
import { ApiProperty } from '@nestjs/swagger';
import { UserGenderType } from 'src/common/Enums';


export class UpdateUserDto {
    @ApiProperty()
    user_name: string

    @ApiProperty()
    user_email: string

    @ApiProperty()
    user_profile_id: number

    @ApiProperty()
    user_date_of_birth: string

    @ApiProperty()
    user_phone: string

    @ApiProperty()
    psychologist_id?: string;

    @ApiProperty()
    user_genre?: UserGenderType

    @ApiProperty({ required: false })
    user_rg?: string

    @ApiProperty({ required: false })
    user_cpf?: string
}
