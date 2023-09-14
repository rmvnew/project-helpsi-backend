import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';



@Entity('UNAVAILABLE_TIMES')
export class UnavailableTimes {

    @PrimaryGeneratedColumn('uuid')
    unavailable_id: string;

    @Column({ type: 'datetime' })
    unavailable_start_time: Date;

    @Column({ type: 'datetime' })
    unavailable_end_time: Date;

    @ManyToOne(() => UserEntity, user => user.unavailableTimes)
    @JoinColumn({
        name: 'psychologist_id',
        referencedColumnName: 'user_id'
    })
    psychologist: UserEntity;
}