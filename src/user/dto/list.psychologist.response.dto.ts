import { Expose } from "class-transformer";





export class ListPsychologistResponseDto {
    @Expose()
    user_id: string;

    @Expose()
    user_name: string;

}