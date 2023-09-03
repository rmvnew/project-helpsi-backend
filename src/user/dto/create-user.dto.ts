import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { CreateAddressDto } from "src/address/dto/create-address.dto";

export class CreateUserDto {
    @ApiProperty()
    user_name: string

    @ApiProperty()
    user_email: string

    @ApiProperty()
    user_phone: string

    @ApiProperty()
    user_password: string

    @ApiProperty()
    user_profile_id: number

    @ApiProperty()
    user_date_of_birth: string

    @IsOptional()
    address?: CreateAddressDto
}
