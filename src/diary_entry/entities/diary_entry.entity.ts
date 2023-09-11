import { PatientDetails } from "src/patient_details/entities/patient_detail.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('DIARY_ENTRY')
export class DiaryEntry {

    @PrimaryGeneratedColumn('uuid')
    diary_entry_id: string;

    @CreateDateColumn()
    register_date: Date;

    @Column({ type: 'text' })
    text: string;

    @UpdateDateColumn()
    update_at: Date

    @ManyToOne(() => PatientDetails, patient => patient.diary_entries)
    @JoinColumn({
        name: 'patient_details_id',
        referencedColumnName: 'patient_details_id'
    })
    patient: PatientDetails;

}
