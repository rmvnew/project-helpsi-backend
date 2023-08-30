import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";

export class CreateUserDto {
    @ApiProperty()
    user_name: string

    @ApiProperty()
    user_email: string

    @ApiProperty()
    user_enrollment: string

    @ApiProperty()
    user_password: string

    @ApiProperty()
    user_profile_id: number

    @ApiProperty()
    user_2fa_active: boolean

    @IsOptional()
    address?: CreateAddressDto
}
