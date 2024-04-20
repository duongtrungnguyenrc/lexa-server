import { Module } from "@nestjs/common";
import { UserModule, TopicModule, SearchModule, AuthModule, ChatModule } from "@/modules";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { AnalysisService } from "@/services";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from "cache-manager-redis-store";

@Module({
    imports: [
        AuthModule,
        UserModule,
        TopicModule,
        SearchModule,
        ChatModule,
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
        MongooseModule.forRoot(process.env.CONNECTION_STRING),
        CacheModule.register({
            isGlobal: true,
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD,
            ttl: 300000,
        }),
    ],
    providers: [AnalysisService],
    exports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" })],
})
export class AppModule {}
