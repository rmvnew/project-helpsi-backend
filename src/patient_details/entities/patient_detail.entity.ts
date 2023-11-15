import { DiaryEntry } from "src/diary_entry/entities/diary_entry.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('PATIENT_DETAILS')
export class PatientDetails {

    @PrimaryGeneratedColumn('uuid')
    patient_details_id: string

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'text', nullable: true })
    consultation_reason: string;

    @Column({ type: 'text', nullable: true })
    previous_diagnosis: string;

    @Column({ type: 'text', nullable: true })
    diagnosis: string;

    @Column({ type: 'text', nullable: true })
    session_frequency: string;

    @Column({ type: 'text', nullable: true })
    last_session_date: string;

    @Column({ type: 'text', nullable: true })
    current_status: string;

    @OneToOne(() => UserEntity, user => user.patientDetails)
    user: UserEntity;

    @OneToMany(() => DiaryEntry, diaryEntry => diaryEntry.patient_details)
    diary_entries: DiaryEntry[];




}
