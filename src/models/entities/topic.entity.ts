import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import Folder from "./folder.entity";
import Vocabulary from "./vocabulary.entity";
import UserInterested from "./user-interested.entity";

@Entity()
export default class Topic {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    visibility: boolean;

    @Column()
    thumbnail: string;

    @Column()
    createdTime: Date;

    @ManyToMany(() => Folder)
    @JoinTable()
    folders: Folder[];

    @OneToMany(() => Vocabulary, (Vocabulary) => Vocabulary.topic)
    vocabularies: Vocabulary[];

    @OneToMany(() => UserInterested, (userInterested) => userInterested.topic)
    userInteresteds: UserInterested[];
}
