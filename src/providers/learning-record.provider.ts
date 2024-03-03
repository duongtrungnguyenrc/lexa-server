import { DataSource } from "typeorm";
import { LearningRecord } from "@/models/entities";

export const LearningRecordProvider = [
    {
        provide: "LEARNING_RECORD_REPOSITORY",
        useFactory: (dataSource: DataSource) => dataSource.getRepository(LearningRecord),
        inject: ["DATA_SOURCE"],
    },
];
