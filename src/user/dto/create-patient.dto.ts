import { ApiProperty } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class CreatePatientDto extends CreateUserDto {

    @ApiProperty()
    psychologist_id: string;
}
