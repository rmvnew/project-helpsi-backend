import { Expose } from "class-transformer";



export class PatientDetailsResponseDto {

    @Expose()
    patient_details_id: string

    @Expose()
    start_date: Date;

    @Expose()
    consultation_reason: string;

    @Expose()
    previous_diagnosis: string;

    @Expose()
    diagnosis: string;

    @Expose()
    session_frequency: string;

    @Expose()
    current_status: string;


}