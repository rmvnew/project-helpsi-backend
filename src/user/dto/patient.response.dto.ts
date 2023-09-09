import { Expose } from "class-transformer";
import { Address } from "src/address/entities/address.entity";
import { Specialty } from "src/specialty/entities/specialty.entity";
import { PsychologistResponseDto } from "./psychologist.response.dto";





export class PatientResponseDto {

    @Expose()
    user_id: string

    @Expose()
    user_name: string

    @Expose()
    user_email: string

    @Expose()
    user_status: boolean

    @Expose()
    user_date_of_birth: string

    @Expose()
    user_phone: string

    @Expose()
    user_enrollment: string

    @Expose()
    user_profile_id: number

    @Expose()
    user_crp: string

    @Expose()
    create_at: Date

    @Expose()
    update_at: Date

    @Expose()
    psychologist: PsychologistResponseDto

    @Expose()
    address: Address

    @Expose()
    specialtys: Specialty[]

}