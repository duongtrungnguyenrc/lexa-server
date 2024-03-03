import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ELearningMethod } from "@/models/enums";
import User from "@/models/entities/user.entity";
import Vocabulary from "./vocabulary.entity";

@Entity()
export default class LearningRecord {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "int", default: 0 })
    count: number;

    @Column()
    time: Date;

    @Column({
        type: "enum",
        enum: ["METHOD_FLASH_CARD", "METHOD_MULTIPLE_CHOICE", "METHOD_TYPING"],
        nullable: false,
    })
    method: ELearningMethod;

    @Column({ type: "tinyint", default: 0 })
    result: boolean;

    @ManyToOne(() => User, (user) => user.records)
    user: User;

    @ManyToOne(() => Vocabulary, (vocabulary) => vocabulary.records)
    vocabulary: Vocabulary;
}
