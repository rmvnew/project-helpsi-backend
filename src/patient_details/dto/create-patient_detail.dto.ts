import { ApiProperty } from "@nestjs/swagger";


export class CreatePatientDetailDto {



    @ApiProperty()
    consultation_reason?: string = null

    @ApiProperty()
    previous_diagnosis?: string = null

    @ApiProperty()
    diagnosis?: string = null

    @ApiProperty()
    therapy_type?: string = null

    @ApiProperty()
    session_frequency?: string = null

    @ApiProperty()
    last_session_date?: string = null

    @ApiProperty()
    current_status?: string = null



}
