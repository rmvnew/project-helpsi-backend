import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";



export class ComplementEntity {

    @CreateDateColumn()
    create_at: Date

    @UpdateDateColumn()
    update_at: Date

    @Column()
    is_active: boolean = true
}