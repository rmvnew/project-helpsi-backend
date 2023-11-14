import { ComplementEntity } from "src/common/ComplementEntity";
import { PatientDetails } from "src/patient_details/entities/patient_detail.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('DIARY_ENTRY')
export class DiaryEntry extends ComplementEntity {

    @PrimaryGeneratedColumn('uuid')
    diary_entry_id: string;

    @CreateDateColumn()
    register_date: Date;

    @Column({ type: 'text' })
    text: string;


    @ManyToOne(() => PatientDetails, patient => patient.diary_entries)
    @JoinColumn({
        name: 'patient_details_id',
        referencedColumnName: 'patient_details_id'
    })
    patient_details: PatientDetails;

}
