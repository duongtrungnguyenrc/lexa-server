import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "@/models/dtos";
import { BaseResponseModel } from "@/models";
import { UserService } from "@/services";
import { User } from "@/models/schemas";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService, private jwtService: JwtService) {}

    async validateUser(user: LoginDto) {
        const existingUser: User | null = await this.userService.findUserByEmail(user.email);

        if (!existingUser) {
            throw new HttpException("Invalid email!", HttpStatus.UNAUTHORIZED);
        }

        try {
            const isPasswordMatch = await bcrypt.compare(user.password, existingUser.password);

            if (!isPasswordMatch) {
                throw new HttpException("Invalid password!", HttpStatus.UNAUTHORIZED);
            }

            delete existingUser.password;
            const userPayload = {
                id: existingUser.id,
                email: existingUser.email,
                fullName: existingUser.name,
                role: existingUser.role,
            };

            return new BaseResponseModel("Login successfully!", {
                accessToken: await this.jwtService.signAsync(userPayload),
                user: existingUser,
            });
        } catch (error) {
            throw error;
        }
    }
}
