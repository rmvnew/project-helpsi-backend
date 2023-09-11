import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('ADDRESS')
export class Address {


    @PrimaryGeneratedColumn('uuid')
    address_id: string

    @Column()
    address_city: string

    @Column()
    address_district: string

    @Column()
    address_home_number: string

    @Column()
    address_state: string

    @Column()
    address_street: string

    @Column()
    address_zipcode: string


}
