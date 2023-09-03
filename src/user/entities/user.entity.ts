import * as speakeasy from 'speakeasy';
import { Address } from 'src/address/entities/address.entity';
import { UserGenderType } from 'src/common/Enums';
import { HistoricRecover } from "src/historic-recover/entities/historic-recover.entity";
import { ProfileEntity } from "src/profile/entities/profile.entity";
import { Specialty } from 'src/specialty/entities/specialty.entity';
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

    @Column()
    user_phone: string

    @Column()
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

    @Column()
    user_password: string

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

    @OneToOne(() => Address, { nullable: true, cascade: true })
    @JoinColumn({ name: 'address_id' })
    address?: Address

    @ManyToOne(() => UserEntity, psychologist => psychologist.patients)
    @JoinColumn({ name: 'psychologist_id' })
    psychologist?: UserEntity;

    @OneToMany(() => UserEntity, patient => patient.psychologist)
    patients?: UserEntity[];

    @ManyToMany(() => Specialty, specialty => specialty.users)
    @JoinTable({
        name: 'user_specialty',
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

    setTwoFactorSecret() {
        this.user_2fa_secret = speakeasy.generateSecret({ length: 20 }).base32
    }
}
