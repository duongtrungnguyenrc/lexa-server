import { DataSource, DataSourceOptions } from "typeorm";
import { createDatabase } from "typeorm-extension";

/* Provider define for database connection */

export const databaseProviders = [
    {
        provide: "DATA_SOURCE",
        useFactory: async () => {
            const options: DataSourceOptions = {
                type: "mysql",
                host: process.env.DATABASE_HOST,
                port: parseInt(process.env.DATABASE_PORT),
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                entities: [__dirname + "/../**/*.entity{.ts,.js}"],
                synchronize: true,
            };

            await createDatabase({
                options,
            });

            const dataSource = new DataSource(options);
            return dataSource.initialize();
        },
    },
];
