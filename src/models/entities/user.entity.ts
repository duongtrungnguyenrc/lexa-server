import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ERole } from "../enums";

@Entity()
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 50 })
    email: string;

    @Column({ type: "varchar", length: 20 })
    password: string;

    @Column({ type: "nvarchar", length: 50 })
    fullName: string;

    @Column({ type: "varchar", length: 10 })
    phone: string;

    @Column()
    active: boolean;

    @Column({ type: "enum", enum: ERole, default: ERole.ROLE_USER })
    role: ERole;
}
