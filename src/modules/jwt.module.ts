import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [ConfigModule.forRoot({ envFilePath: '.env' }),
        JwtModule.register({
            secret: process.env.AUTHORIZATION_SECRET,
            signOptions: { expiresIn: 3600 },
        }),
    ],
    exports: [
        JwtModule.register({
            secret: process.env.AUTHORIZATION_SECRET,
            signOptions: { expiresIn: 3600 },
        }),
    ],
})
export class JwtConfigModule {}
