import { Expose } from "class-transformer"






export class AddressResponseDto {

    @Expose()
    address_id: string

    @Expose()
    address_city: string

    @Expose()
    address_district: string

    @Expose()
    address_home_number: string

    @Expose()
    address_state: string

    @Expose()
    address_street: string

    @Expose()
    address_zipcode: string
}