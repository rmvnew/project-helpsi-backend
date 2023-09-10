import { ApiProperty } from "@nestjs/swagger";



export class CreateSchedulingDto {

    @ApiProperty()
    duration: number

    @ApiProperty()
    select_date_time: string

    @ApiProperty()
    patient_id: string;

    @ApiProperty()
    psychologist_id: string;

    @ApiProperty()
    registrant_name?: string

}
