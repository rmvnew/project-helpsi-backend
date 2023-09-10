import { PatientDetails } from "src/patient_details/entities/patient_detail.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity('MEDICATION')
export class Medication {

    @PrimaryGeneratedColumn('uuid')
    medication_id: string

    @Column({ type: 'date' })
    prescription_date: Date;

    @Column({ type: 'text' })
    medication_name: string;

    @ManyToOne(() => PatientDetails, patient => patient.medications)
    @JoinColumn({
        name: 'patient_details_id',
        referencedColumnName: 'patient_details_id'
    })
    patient: PatientDetails;

}
