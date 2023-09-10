import { UserEntity } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('SCHEDULING')
export class Scheduling {

    @PrimaryGeneratedColumn('uuid')
    scheduling_id: string;

    @Column({ type: 'datetime' })
    start_time: Date;

    @Column({ type: 'datetime' })
    end_time: Date;

    @Column()
    registrant_name?: string

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date

    @ManyToOne(() => UserEntity, user => user.appointments)
    @JoinColumn({ name: 'patient_id' })
    patient: UserEntity;

    @ManyToOne(() => UserEntity, user => user.appointmentsAsPsychologist)
    @JoinColumn({ name: 'psychologist_id' })
    psychologist: UserEntity;

    @Column({ default: false })
    isCancelled: boolean;

}
