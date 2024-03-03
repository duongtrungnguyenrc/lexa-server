import { DataSource } from "typeorm";
import { UserInterested } from "@/models/entities";

export const UserInterestedProviders = [
    {
        provide: "USER_INTERESTED_REPOSITORY",
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserInterested),
        inject: ["DATA_SOURCE"],
    },
];
