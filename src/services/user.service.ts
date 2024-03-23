/**
 * Created by Duong Trung Nguyen on 2024/1/24.
 */

import { BadRequestException, HttpException, HttpStatus, Injectable, NotAcceptableException } from "@nestjs/common";
import { CloudinaryResponse, CreateUserDto, UpdateProfileDto, LoginDto } from "@/models/dtos";
import * as bcrypt from "bcrypt";
import { BaseResponseModel } from "@/models";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { RequestHandlerUtils } from "@/utils";
import { CloudinaryService } from "./cloudinary.service";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "@/models/schemas";
import { Model } from "mongoose";
import { EmailAlreadyExistsException, InvalidPasswordException, ResourceNotFoundException } from "@/exceptions";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async getUserFromRequest(request: Request, excludes: string[] = []): Promise<User> {
        const authToken: string = RequestHandlerUtils.getAuthToken(request);
        const decodedToken: User = this.jwtService.decode(authToken);
        return await this.userModel
            .findOne({
                _id: decodedToken.id,
            })
            .select([...excludes.map((key) => `-${key}`)])
            .lean();
    }

    async createUser(newUser: CreateUserDto): Promise<BaseResponseModel> {
        const { password, ...userInfo } = newUser;
        const existingUser: User | null = await this.findUserByEmail(userInfo.email);

        try {
            if (existingUser) {
                throw new EmailAlreadyExistsException();
            }

            const hashedPassword: string = await bcrypt.hash(password, 10);

            const createdUser: User = (
                await this.userModel.create({
                    password: hashedPassword,
                    ...userInfo,
                })
            )?.toObject();

            delete createdUser.password;
            delete createdUser.records;

            this.mailerService.sendMail({
                to: createdUser.email,
                subject: "WELCOME TO VOCAB MASTER",
                template: "register",
                context: { user: userInfo.name },
            });

            return new BaseResponseModel("Successfully to created new user!", createdUser);
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }

    async validateUser(user: LoginDto) {
        try {
            const { password, ...existingUser } = (
                await this.findUserByEmail(user.email, true, ["records"])
            )?.toObject();

            if (!existingUser) {
                throw new ResourceNotFoundException("User not found. please check your email or password");
            }

            const isPasswordMatch = await bcrypt.compare(user.password, password);

            if (!isPasswordMatch) {
                throw new InvalidPasswordException();
            }

            const userPayload = {
                id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
                role: existingUser.role,
            };

            return new BaseResponseModel("Login successfully!", {
                accessToken: await this.jwtService.signAsync(userPayload),
                user: existingUser,
            });
        } catch (error) {
            throw new BadRequestException(new BaseResponseModel(error.message));
        }
    }

    async findUserByEmail(email: string, includePassword: boolean = false, exclude?: string[]): Promise<User> {
        return await this.userModel
            .findOne({
                email: email,
            })
            .select([includePassword ? "+password" : "", ...(exclude?.map((key) => `-${key}`) ?? "")])
            .exec();
    }

    async getUserProfile(request: Request) {
        try {
            const user: User | null = await this.getUserFromRequest(request, ["records"]);
            delete user.password;

            return new BaseResponseModel("Successfully to get user profile!", user);
        } catch (error) {
            throw error;
        }
    }

    async updateAvatar(imageFile: Express.Multer.File, request: Request): Promise<BaseResponseModel> {
        const user: User | null = await this.getUserFromRequest(request);

        try {
            const uploadedImage: CloudinaryResponse = await this.cloudinaryService.uploadFile(imageFile);

            await this.userModel.updateOne(
                { id: user._id },
                {
                    avatar: uploadedImage.secure_url,
                },
            );

            const updatedUser: User = await this.userModel.findOne({ _id: user._id });
            delete updatedUser.password;

            return new BaseResponseModel("Successfully to update avatar!", updatedUser);
        } catch (error) {
            throw new HttpException("Failed to update profile: " + error, HttpStatus.BAD_REQUEST);
        }
    }

    async updateProfile(newProfile: UpdateProfileDto, request: Request): Promise<BaseResponseModel> {
        const user: User | null = await this.getUserFromRequest(request);

        try {
            const updatedResult = await this.userModel.updateOne(
                { id: user._id },
                {
                    name: newProfile.name ?? user.name,
                    password: (await bcrypt.hash(newProfile.password, 10)) ?? user.password,
                    phone: newProfile.phone ?? user.phone,
                },
            );
            return new BaseResponseModel("Successfully to update profile", updatedResult);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    // async resetPassword(newPassword: UpdatePasswordDto, request: Request): Promise<BaseResponseModel> {
    //     const user: User | null = await this.getUserFromRequest(request); ///
    //     return;
    // }
}
