import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";
import { Specialty } from "src/specialty/entities/specialty.entity";

export class CreateUserDto {
    @ApiProperty()
    user_name: string

    @ApiProperty()
    user_email: string

    @IsOptional()
    user_phone?: string

    @ApiProperty()
    user_password?: string

    @ApiProperty()
    user_profile_id: number

    @ApiProperty()
    user_date_of_birth: string

    @IsOptional()
    user_crp?: string

    @IsOptional()
    address?: CreateAddressDto

    @IsOptional()
    specialtys?: Specialty[]


}
