/**
 * Created by Duong Trung Nguyen on 2024/1/24.
 */

import {
    BadRequestException,
    HttpException,
    HttpStatus,
    Inject,
    Injectable,
    NotAcceptableException,
} from "@nestjs/common";
import {
    CloudinaryResponse,
    CreateUserDto,
    UpdateInterestedTopicDto,
    UpdateProfileDto,
    LearningRecordDto,
    LoginDto,
} from "@/models/dtos";
import { Topic, User, UserInterested } from "@/models/entities";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";
import { BaseResponseModel } from "@/models";
import { MailerService } from "@nestjs-modules/mailer";
import { JwtService } from "@nestjs/jwt";
import { RequestHandlerUtils } from "@/utils";
import { CloudinaryService } from "./cloudinary.service";
import { InjectModel } from "@nestjs/mongoose";
import { User as MongooseUser } from "@/models/schemas";
import { Model } from "mongoose";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(MongooseUser.name) private readonly mongooseUserModel: Model<MongooseUser>,
        private readonly jwtService: JwtService,
        private readonly mailerService: MailerService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    private async getUserFromRequest(request: Request): Promise<MongooseUser> {
        const authToken: string = RequestHandlerUtils.getAuthToken(request);
        const decodedToken: User = this.jwtService.decode(authToken);
        return await this.mongooseUserModel.findOne({
            _id: decodedToken.id,
        });
    }

    async createUser(newUser: CreateUserDto): Promise<BaseResponseModel> {
        const { password, ...user } = newUser;
        const existingUser: MongooseUser | null = await this.findUserByEmail(user.email);

        /* check existing user */

        if (existingUser) {
            throw new HttpException("Email already exists!", HttpStatus.BAD_REQUEST);
        }

        try {
            const hashedPassword: string = await bcrypt.hash(password, 10);

            const createdUser: MongooseUser = await this.mongooseUserModel.create({
                password: hashedPassword,
                ...user,
            });
            delete createdUser.password;

            this.mailerService.sendMail({
                to: createdUser.email,
                subject: "WELCOME TO VOCAB MASTER",
                template: "register",
                context: { user: user.name },
            });

            return new BaseResponseModel(201, "Successfully to created new user!", createdUser);
        } catch (error) {
            throw new NotAcceptableException(error);
        }
    }

    async validateUser(user: LoginDto) {
        const existingUser: MongooseUser | null = await this.findUserByEmail(user.email);

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
                id: existingUser._id,
                email: existingUser.email,
                name: existingUser.name,
                role: existingUser.role,
            };

            return new BaseResponseModel(200, "Login successfully!", {
                accessToken: await this.jwtService.signAsync(userPayload),
                user: existingUser,
            });
        } catch (error) {
            throw error;
        }
    }

    async findUserByEmail(email: string): Promise<MongooseUser> {
        return await this.mongooseUserModel.findOne({
            email: email,
        });
    }

    async getUserProfile(request: Request) {
        try {
            const user: MongooseUser | null = await this.getUserFromRequest(request);
            delete user.password;

            return new BaseResponseModel(200, "Successfully to get user profile!", user);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    async updateAvatar(imageFile: Express.Multer.File, request: Request): Promise<BaseResponseModel> {
        const user: MongooseUser | null = await this.getUserFromRequest(request);

        try {
            const uploadedImage: CloudinaryResponse = await this.cloudinaryService.uploadFile(imageFile);

            await this.mongooseUserModel.updateOne(user, {
                avatar: uploadedImage.secure_url,
            });

            const updatedUser: MongooseUser = await this.mongooseUserModel.findOne({ _id: user._id });
            delete updatedUser.password;

            return new BaseResponseModel(200, "Successfully to update avatar!", updatedUser);
        } catch (error) {
            throw new HttpException("Failed to update profile: " + error, HttpStatus.BAD_REQUEST);
        }
    }

    async updateProfile(newProfile: UpdateProfileDto, request: Request): Promise<BaseResponseModel> {
        const user: MongooseUser | null = await this.getUserFromRequest(request);

        try {
            const updatedResult = await this.mongooseUserModel.updateOne(user, {
                name: newProfile.name ?? user.name,
                password: (await bcrypt.hash(newProfile.password, 10)) ?? user.password,
                phone: newProfile.phone ?? user.phone,
            });
            return new BaseResponseModel(200, "Successfully to update profile", updatedResult);
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    // async resetPassword(newPassword: UpdatePasswordDto, request: Request): Promise<BaseResponseModel> {
    //     const user: User | null = await this.getUserFromRequest(request); ///
    //     return;
    // }
}
