import * as speakeasy from 'speakeasy';
import { Address } from 'src/address/entities/address.entity';
import { UserGenderType } from 'src/common/Enums';
import { HistoricRecover } from "src/historic_recover/entities/historic-recover.entity";
import { PatientDetails } from 'src/patient_details/entities/patient_detail.entity';
import { ProfileEntity } from "src/profile/entities/profile.entity";
import { Scheduling } from 'src/scheduling/entities/scheduling.entity';
import { Specialty } from 'src/specialty/entities/specialty.entity';
import { UnavailableTimes } from 'src/unavailable-times/entities/unavailable-time.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('USER')
export class UserEntity {

    @PrimaryGeneratedColumn('uuid')
    user_id: string

    @Column()
    user_name: string

    @Column()
    user_email: string

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    user_date_of_birth: Date

    @Column({ type: 'enum', enum: UserGenderType, nullable: true })
    user_genre?: UserGenderType

    @Column({ nullable: true })
    google_id?: string

    @Column({ nullable: true })
    google_picture?: string

    @Column({ nullable: true })
    user_phone?: string

    @Column({ nullable: true })
    user_rg?: string

    @Column({ nullable: true })
    user_cpf?: string

    @Column({ nullable: true })
    user_crp?: string

    @Column({ nullable: true })
    user_enrollment?: string

    @Column({ nullable: true })
    user_recovery_code: number

    @Column({ nullable: true })
    user_attempts_to_recover: number

    @Column({ nullable: true })
    user_recovery_date: Date

    @Column({ nullable: true })
    user_2fa_secret: string

    @Column({ default: false })
    user_2fa_active: boolean

    @Column({ default: false })
    pre_registration: boolean

    @Column({ nullable: true })
    user_password?: string

    @Column()
    user_profile_id: number

    @Column()
    user_status: boolean

    @Column()
    user_first_access: boolean

    @ManyToOne(() => ProfileEntity, (profile) => profile.users)
    @JoinColumn({ name: 'user_profile_id' })
    profile: ProfileEntity

    @Column({ nullable: true })
    user_refresh_token: string;

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date

    @OneToMany(() => HistoricRecover, recover => recover.user)
    historics: HistoricRecover[];

    @OneToOne(() => Address, { nullable: true, cascade: true, eager: true })
    @JoinColumn({ name: 'address_id' })
    address?: Address

    @ManyToOne(() => UserEntity, psychologist => psychologist.patients)
    @JoinColumn({ name: 'psychologist_id' })
    psychologist?: UserEntity;

    @OneToMany(() => UserEntity, patient => patient.psychologist)
    patients?: UserEntity[];

    @ManyToMany(() => Specialty, specialty => specialty.users)
    @JoinTable({
        name: 'USER_SPECIALTY',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'user_id'
        },
        inverseJoinColumn: {
            name: 'specialty_id',
            referencedColumnName: 'specialty_id'
        }
    })
    specialtys?: Specialty[]

    @OneToOne(() => PatientDetails, patientDetails => patientDetails.user)
    @JoinColumn({
        name: 'patient_details_id',
        referencedColumnName: 'patient_details_id'
    })
    patientDetails: PatientDetails;

    @OneToMany(() => Scheduling, appointment => appointment.patient)
    appointments: Scheduling[];

    @OneToMany(() => Scheduling, appointment => appointment.psychologist)
    appointmentsAsPsychologist: Scheduling[];

    @OneToMany(() => UnavailableTimes, times => times.psychologist)
    unavailableTimes: UnavailableTimes[];

    setTwoFactorSecret() {
        this.user_2fa_secret = speakeasy.generateSecret({ length: 20 }).base32
    }
}
