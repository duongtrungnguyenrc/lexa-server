import { Module } from "@nestjs/common";
import { AuthModule, UserModule } from "@/modules";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [AuthModule, UserModule, ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' })],
    controllers: [],
    providers: [],
})
export class AppModule {}
