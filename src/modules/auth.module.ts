import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import { userProviders, databaseProviders } from "@/providers";
import { UserService, AuthService } from "../services";
import { JwtConfigModule } from './jwt.module';

@Module({
    controllers: [AuthController],
    providers: [
        UserService,
        AuthService,
        ...databaseProviders,
        ...userProviders,
    ],
    imports: [JwtConfigModule],
})
export class AuthModule {}
