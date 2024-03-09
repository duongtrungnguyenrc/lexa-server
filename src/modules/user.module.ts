import { Module } from "@nestjs/common";
import { UserController } from "@/controllers";
import { UserService } from "@/services";
import { JwtConfigModule } from "./jwt.module";
import { MailModule } from "./mail.module";
import { CloudinaryModule } from "./cloudinary.module";
import { MongooseInteractionModule } from "./mongoose-interaction.module";

@Module({
    imports: [JwtConfigModule, MailModule, CloudinaryModule, MongooseInteractionModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [JwtConfigModule, CloudinaryModule, UserService],
})
export class UserModule {}
