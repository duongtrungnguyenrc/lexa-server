import { Module } from "@nestjs/common";
import { UserModule, TopicModule, SearchModule, AuthModule, ChatModule } from "@/modules";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { AnalysisService } from "@/services";

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
    ],
    controllers: [],
    providers: [AnalysisService],
    exports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" })],
})
export class AppModule {}
