import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import Topic from "./topic.entity";
import LearningRecord from "./learning-record.entity";

@Entity()
export default class Vocabulary {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    word: string;

    @Column()
    meaning: string;

    @Column()
    description: string;

    @Column()
    imgDescription: string;

    @Column()
    createdTime: Date;

    @ManyToOne(() => Topic, (topic) => topic.vocabularies)
    topic: Topic;

    @OneToMany(
        () => LearningRecord,
        (LearningRecord) => LearningRecord.vocabulary,
    )
    records: LearningRecord[];
}
