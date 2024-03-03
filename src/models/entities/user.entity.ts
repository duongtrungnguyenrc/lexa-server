import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { EUserRole } from "src/models/enums";
import LearningRecord from "./learning-record.entity";
import UserInterested from "./user-interested.entity";

@Entity()
export default class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 50, nullable: false })
    email: string;

    @Column({ type: "varchar", length: 100, nullable: false })
    password: string;

    @Column({ type: "nvarchar", length: 50, nullable: false })
    fullName: string;

    @Column({ type: "varchar", length: 10, nullable: false })
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({
        type: "enum",
        enum: ["ROLE_USER", "ROLE_ADMIN"],
        default: "ROLE_USER",
        nullable: false,
    })
    role: EUserRole;

    @OneToMany(
        () => LearningRecord,
        (LearningRecord) => LearningRecord.vocabulary,
    )
    records: LearningRecord[];

    @OneToMany(() => UserInterested, userInterested => userInterested.user)
    interestedTopics: UserInterested[];
}
