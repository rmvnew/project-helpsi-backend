import { ApiProperty } from "@nestjs/swagger";



export class CreateSchedulingDto {

    @ApiProperty()
    duration: number

    @ApiProperty()
    selectDateTime: Date

    @ApiProperty()
    patient_id: string;

    @ApiProperty()
    psychologist_id: string;

}
