import { DataSource } from "typeorm";
import { Topic } from "@/models/entities";

export const TopicProvider = [
    {
        provide: "TOPIC_REPOSITORY",
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Topic),
        inject: ["DATA_SOURCE"],
    },
];
