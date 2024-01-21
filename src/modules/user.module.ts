import { Module } from "@nestjs/common";
import { userProviders, databaseProviders } from "@/providers";
import { UserController } from "@/controllers";
import { UserService } from "@/services";
import { JwtConfigModule } from "./jwt.module";
import { MailModule } from "./mail.module";

@Module({
    imports: [JwtConfigModule, MailModule],
    controllers: [UserController],
    providers: [UserService, ...databaseProviders, ...userProviders],
})
export class UserModule {}
