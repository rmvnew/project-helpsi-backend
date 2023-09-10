import { DiaryEntry } from "src/diary_entry/entities/diary_entry.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('PATIENT_DETAILS')
export class PatientDetails {

    @PrimaryGeneratedColumn('uuid')
    patient_details_id: string

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'text' })
    consultation_reason: string;

    @Column({ type: 'text', nullable: true })
    diagnosis: string;

    @Column({ type: 'text' })
    therapy_type: string;

    @Column({ type: 'text' })
    session_frequency: string;

    @Column({ type: 'date', nullable: true })
    last_session_date: Date;

    @Column({ type: 'text' })
    current_status: string;

    @OneToOne(() => UserEntity, user => user.patientDetails)
    user: UserEntity;

    @OneToMany(() => DiaryEntry, diaryEntry => diaryEntry.patient)
    diary_entries: DiaryEntry[];




}
