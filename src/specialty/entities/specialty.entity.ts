import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('SPECIALTY')
export class Specialty {

    @PrimaryGeneratedColumn('uuid')
    specialty_id: string

    @Column()
    specialty_name: string


    @ManyToMany(() => UserEntity, user => user.specialtys)
    users: UserEntity[];

}
