import { Expose } from "class-transformer";
import { Address } from "src/address/entities/address.entity";
import { Specialty } from "src/specialty/entities/specialty.entity";
import { UserResponseDto } from "./user.response.dto";

export class PsychologistResponseDto {

    @Expose()
    user_id: string;

    @Expose()
    user_name: string;

    @Expose()
    user_email: string;

    @Expose()
    user_status: boolean;

    @Expose()
    user_date_of_birth: string

    @Expose()
    user_phone: string

    @Expose()
    user_enrollment: string;

    @Expose()
    user_profile_id: number;

    @Expose()
    user_crp: string

    @Expose()
    address: Address

    @Expose()
    specialtys: Specialty[]

    @Expose()
    create_at: Date;

    @Expose()
    update_at: Date;

    @Expose()
    patients: UserResponseDto[];
}
