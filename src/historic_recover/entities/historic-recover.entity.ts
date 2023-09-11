import { UserEntity } from "src/user/entities/user.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"




@Entity('HISTORIC_RECOVER')
export class HistoricRecover {

    @PrimaryGeneratedColumn({ name: 'historic_recover_id' })
    historicRecoverId: number

    @Column({ name: 'historic_recover_date', type: 'date' })
    historicRecoverDate: Date

    @Column({ name: 'historic_quantity' })
    historicQuantity: number


    @ManyToOne(() => UserEntity, user => user.historics)
    user: UserEntity


}

