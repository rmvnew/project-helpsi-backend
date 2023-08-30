import { IsNotEmpty } from 'class-validator';


export class CreateAddressDto {

    @IsNotEmpty()
    address_city: string

    @IsNotEmpty()
    address_district: string

    @IsNotEmpty()
    address_home_number: string

    @IsNotEmpty()
    address_state: string

    @IsNotEmpty()
    address_street: string

    @IsNotEmpty()
    address_zipcode: string


}
