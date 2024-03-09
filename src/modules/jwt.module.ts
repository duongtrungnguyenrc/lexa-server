import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: ".env" }),
        JwtModule.register({
            secret: process.env.AUTHORIZATION_SECRET,
            signOptions: { expiresIn: "150 days" },
        }),
    ],
    exports: [
        JwtModule.register({
            secret: process.env.AUTHORIZATION_SECRET,
            signOptions: { expiresIn: "150 days" },
        }),
    ],
})
export class JwtConfigModule {}
