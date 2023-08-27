import * as speakeasy from 'speakeasy';
import { HistoricRecover } from "src/historic-recover/entities/historic-recover.entity";
import { ProfileEntity } from "src/profile/entities/profile.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('USER')
export class UserEntity {

    @PrimaryGeneratedColumn()
    user_id: number

    @Column()
    user_name: string

    @Column()
    user_email: string

    @Column()
    user_enrollment: string

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

    setTwoFactorSecret() {
        this.user_2fa_secret = speakeasy.generateSecret({ length: 20 }).base32
    }
}
