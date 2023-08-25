import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('HistoricRecover')
export class HistoricRecover {


    @PrimaryGeneratedColumn()
    recover_historic_id: number

    @Column({ type: 'date' })
    recover_date: Date

    @Column()
    recover_quantity: number


    @ManyToOne(() => UserEntity, user => user.historics)
    user: UserEntity

}
