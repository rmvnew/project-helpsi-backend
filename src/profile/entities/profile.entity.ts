import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";




@Entity('PROFILE')
export class ProfileEntity {

    @PrimaryGeneratedColumn()
    profile_id: number

    @Column()
    profile_name: string

    @OneToMany(() => UserEntity, (user) => user.profile)
    users: UserEntity[];

}