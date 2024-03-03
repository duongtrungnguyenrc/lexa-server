import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import User from "./user.entity";
import Topic from "./topic.entity";

@Entity()
export default class UserInterested {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, (user) => user.interestedTopics)
    user: User;

    @ManyToOne(() => Topic, (topic) => topic.userInteresteds)
    topic: Topic;
}
