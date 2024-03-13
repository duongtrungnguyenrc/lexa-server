import { Module } from "@nestjs/common";
import { UserModule, TopicModule, SearchModule } from "@/modules";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { TriggerService } from "./services";

@Module({
    imports: [
        UserModule,
        TopicModule,
        SearchModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
        MongooseModule.forRoot(process.env.CONNECTION_STRING),
    ],
    controllers: [],
    providers: [TriggerService],
    exports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" })],
})
export class AppModule {}
