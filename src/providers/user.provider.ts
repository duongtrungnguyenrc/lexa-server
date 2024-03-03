import { DataSource } from "typeorm";
import { User } from "src/models/entities";

export const UserProvider = [
    {
        provide: "USER_REPOSITORY",
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: ["DATA_SOURCE"],
    },
];
