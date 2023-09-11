import { Expose } from "class-transformer";

export class PsychologistBasicResponseDto {

    @Expose()
    user_id: string;

    @Expose()
    user_name: string;


}
