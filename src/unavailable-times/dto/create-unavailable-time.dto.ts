import { ApiProperty } from "@nestjs/swagger";



export class CreateUnavailableTimeDto {

    @ApiProperty()
    unavailable_start_time: Date;

    @ApiProperty()
    unavailable_end_time: Date;

    @ApiProperty()
    unavailable_psychologist_id: string
}
