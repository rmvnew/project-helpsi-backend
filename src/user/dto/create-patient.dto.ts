import { ApiProperty } from "@nestjs/swagger";
import { UserGenderType } from "src/common/Enums";
import { CreateUserDto } from "./create-user.dto";

export class CreatePatientDto extends CreateUserDto {

    @ApiProperty()
    psychologist_id: string;

    @ApiProperty()
    user_genre?: UserGenderType
}
