import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('SCHEDULING')
export class Scheduling {

    @PrimaryGeneratedColumn('uuid')
    scheduling_id: string;

    @Column({ type: 'datetime' })
    startTime: Date;

    @Column({ type: 'datetime' })
    endTime: Date;

    @ManyToOne(() => UserEntity, user => user.appointments)
    @JoinColumn({ name: 'patient_id' })
    patient: UserEntity;

    @ManyToOne(() => UserEntity, user => user.appointmentsAsPsychologist)
    @JoinColumn({ name: 'psychologist_id' })
    psychologist: UserEntity;

    @Column({ default: false })
    isCancelled: boolean;

}
