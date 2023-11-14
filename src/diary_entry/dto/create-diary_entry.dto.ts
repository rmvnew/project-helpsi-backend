import { ApiProperty } from "@nestjs/swagger";



export class CreateDiaryEntryDto {


    @ApiProperty()
    text: string;

    @ApiProperty()
    patient_details_id: string

}
