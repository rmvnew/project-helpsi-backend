import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, Length } from "class-validator";
import { UserGenderType } from "src/common/Enums";
import { CreateUserDto } from "./create-user.dto";


export class CreatePatientDto extends CreateUserDto {

    @IsOptional()
    psychologist_id?: string;

    @ApiProperty()
    user_genre?: UserGenderType

    @ApiProperty({ required: false })
    @IsOptional()
    @Length(5, 11, { message: 'O RG deve ter entre 5 e 11 caracteres.' })
    user_rg?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @Length(11, 14, { message: 'O CPF deve ter entre 11 e 14 caracteres.' })
    user_cpf?: string


}
