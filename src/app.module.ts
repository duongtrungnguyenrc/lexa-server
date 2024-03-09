import { Module } from "@nestjs/common";
import { UserModule, TopicModule } from "@/modules";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
        UserModule,
        TopicModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" }),
        MongooseModule.forRoot(process.env.CONNECTION_STRING),
    ],
    controllers: [],
    exports: [ConfigModule.forRoot({ isGlobal: true, envFilePath: ".env" })],
})
export class AppModule {}
