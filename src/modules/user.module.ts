import { Module } from "@nestjs/common";
import { UserController } from "@/controllers";
import { UserService } from "@/services";
import { JwtConfigModule } from "./jwt.module";
import { MailModule } from "./mail.module";
import { CloudinaryModule } from "./cloudinary.module";
import { DatabaseInteractionModule } from "./database-interaction.module";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "@/models/schemas";

@Module({
    imports: [
        JwtConfigModule,
        MailModule,
        CloudinaryModule,
        DatabaseInteractionModule,
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [JwtConfigModule, CloudinaryModule, UserService],
})
export class UserModule {}
