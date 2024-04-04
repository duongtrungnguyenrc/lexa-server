import { BadRequestException, HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto, LoginDto } from "@/models/dtos";
import { BaseResponseModel } from "@/models";
import { UserService } from "@/services";
import { InvalidPasswordException, ResourceNotFoundException } from "@/exceptions";
import { OAuth2Client } from "google-auth-library";
import { User } from "@/models/schemas";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        @Inject("GOOGLE_AUTH") private readonly oauth2Client: OAuth2Client,
    ) {}

    async validateUser(emailOrUser: string | LoginDto): Promise<BaseResponseModel> {
        try {
            let email: string;
            let password: string;

            if (typeof emailOrUser === "string") {
                email = emailOrUser;
            } else {
                email = emailOrUser.email;
                password = emailOrUser.password;
            }

            const { password: hashedPassword, ...existingUser } = (
                await this.userService.findUserByEmail(email, true, ["records"])
            )?.toObject();

            if (!existingUser) {
                throw new ResourceNotFoundException("User not found. please check your email or password");
            }

            if (password && !(await bcrypt.compare(password, hashedPassword))) {
                throw new InvalidPasswordException();
            }

            return new BaseResponseModel("Login successfully!", {
                accessToken: await this.jwtService.signAsync({
                    id: existingUser._id,
                    email: existingUser.email,
                    name: existingUser.name,
                    role: existingUser.role,
                }),
                user: existingUser,
            });
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }

    googleAuth() {
        const scopes = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
        ];

        const url: string = this.oauth2Client.generateAuthUrl({
            access_type: "online",
            scope: scopes,
        });

        return url;
    }

    async getGoogleUserInfo(code: string) {
        let loginResponse = null;
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json`, {
                method: "GET",
                headers: {
                    Authorization: `${tokens.token_type} ${tokens.access_token}`,
                },
            });

            const userInfo = await response.json();
            const user: User = await this.userService.findUserByEmail(userInfo.email);

            if (!user) {
                const createdUser: BaseResponseModel = await this.userService.createUser(
                    new CreateUserDto(userInfo.email, "", userInfo.name, "", userInfo.picture),
                );

                const userPayload = {
                    id: createdUser.data?.user.id,
                    email: createdUser.data?.user.email,
                    name: createdUser.data?.user.name,
                    role: createdUser.data?.user.role,
                };

                loginResponse = new BaseResponseModel("Login successfully!", {
                    accessToken: await this.jwtService.signAsync(userPayload),
                    user: createdUser,
                });
            }
            loginResponse = await this.validateUser(userInfo.email);
            return `applinks://lexa.app?payload=${JSON.stringify(loginResponse)}`;
        } catch (error) {
            throw new BadRequestException("Error fetching Google user info: " + error.message);
        }
    }
}
