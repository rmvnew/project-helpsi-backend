import { Expose } from "class-transformer";
import { SpecialtyResponseDto } from "src/specialty/dto/specialty.response.dto";





export class ListPsychologistResponseDto {
    @Expose()
    user_id: string;

    @Expose()
    user_name: string;

    @Expose()
    specialties: SpecialtyResponseDto

}