import { ApiProperty } from "@nestjs/swagger";


export class CreatePatientDetailDto {

    @ApiProperty()
    start_date: Date;

    @ApiProperty()
    consultation_reason: string;

    @ApiProperty()
    diagnosis: string;

    @ApiProperty()
    therapy_type: string;

    @ApiProperty()
    session_frequency: string;

    @ApiProperty()
    last_session_date: Date;

    @ApiProperty()
    current_status: string;

    @ApiProperty()
    patient_id: string

}
