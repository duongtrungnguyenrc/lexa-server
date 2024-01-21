import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { EUserRole } from "src/models/enums";

@Entity()
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 50 })
    email: string;

    @Column({ type: "varchar", length: 100 })
    password: string;

    @Column({ type: "nvarchar", length: 50 })
    fullName: string;

    @Column({ type: "varchar", length: 10 })
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({
        type: "enum",
        enum: ["ROLE_USER", "ROLE_ADMIN"],
        default: "ROLE_USER",
    })
    role: EUserRole;
}
